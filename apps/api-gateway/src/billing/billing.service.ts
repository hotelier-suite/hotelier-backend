import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { Payment } from './entities/payment.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InvoiceStatus } from './enums/invoice-status.enum';
import { InvoiceTotalResultInterface } from './interfaces/invoice-total-result.interface';
import { FinancialSummaryResponseDto } from './dto/financial-summary-response.dto';
import { PaymentStatisticsResponseDto } from './dto/payment-statistics-response.dto';
import { PaymentMethod } from './enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  async findAll(): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      relations: [
        'invoiceItems',
        'reservation',
        'reservation.room',
        'reservation.user',
        'reservation.guest',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Invoice | null> {
    return this.invoiceRepository.findOne({
      where: { id },
      relations: [
        'invoiceItems',
        'reservation',
        'reservation.room',
        'reservation.user',
        'reservation.guest',
      ],
    });
  }

  async create(data: CreateInvoiceDto): Promise<Invoice> {
    return this.invoiceRepository.save({
      ...data,
      number: `INV-${Date.now()}`,
      status: InvoiceStatus.PENDING,
    });
  }

  async updateInvoice(id: number, data: UpdateInvoiceDto): Promise<Invoice> {
    await this.invoiceRepository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    return updated;
  }

  async getInvoicesByStatus(status: InvoiceStatus): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { status },
      relations: [
        'invoiceItems',
        'reservation',
        'reservation.room',
        'reservation.user',
        'reservation.guest',
      ],
      order: { dueDate: 'ASC' },
    });
  }

  async getInvoicesByCustomer(userId: number): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: { userId },
      relations: [
        'invoiceItems',
        'reservation',
        'reservation.room',
        'reservation.user',
        'reservation.guest',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getInvoicesByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<Invoice[]> {
    return this.invoiceRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: [
        'invoiceItems',
        'reservation',
        'reservation.room',
        'reservation.user',
        'reservation.guest',
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async getOverdueInvoices(): Promise<Invoice[]> {
    const now = new Date();
    return this.invoiceRepository.find({
      where: {
        status: InvoiceStatus.PENDING,
        dueDate: LessThan(now),
      },
      relations: [
        'invoiceItems',
        'reservation',
        'reservation.room',
        'reservation.user',
        'reservation.guest',
      ],
      order: { dueDate: 'ASC' },
    });
  }

  async getFinancialSummary(
    startDate: Date,
    endDate: Date,
  ): Promise<FinancialSummaryResponseDto> {
    const totalRevenueResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total)', 'total')
      .where('invoice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<InvoiceTotalResultInterface>();

    const paidResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COUNT(invoice.id)', 'count')
      .addSelect('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: InvoiceStatus.PAID })
      .andWhere('invoice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{ count: string; total: string }>();

    const pendingResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COUNT(invoice.id)', 'count')
      .addSelect('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: InvoiceStatus.PENDING })
      .andWhere('invoice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{ count: string; total: string }>();

    const now = new Date();
    const overdueResult = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('COUNT(invoice.id)', 'count')
      .addSelect('SUM(invoice.total)', 'total')
      .where('invoice.status = :status', { status: InvoiceStatus.PENDING })
      .andWhere('invoice.dueDate < :now', { now })
      .andWhere('invoice.createdAt BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{ count: string; total: string }>();

    return {
      totalRevenue: parseFloat(totalRevenueResult?.total || '0') || 0,
      paidAmount: parseFloat(paidResult?.total || '0') || 0,
      pendingAmount: parseFloat(pendingResult?.total || '0') || 0,
      overdueAmount: parseFloat(overdueResult?.total || '0') || 0,
      totalPaidInvoices: parseInt(paidResult?.count || '0') || 0,
      totalPendingInvoices: parseInt(pendingResult?.count || '0') || 0,
      totalOverdueInvoices: parseInt(overdueResult?.count || '0') || 0,
    };
  }

  async markAsPaid(
    id: number,
    paymentMethod?: PaymentMethod,
  ): Promise<Invoice> {
    const invoice = await this.findOne(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    // Create a payment record for this invoice
    await this.paymentRepository.save({
      reference: `PAY-${Date.now()}-${id}`,
      amount: Number(invoice.total),
      method: paymentMethod ?? PaymentMethod.CASH,
      status: PaymentStatus.COMPLETED,
      invoiceId: invoice.id,
    });

    // Update invoice status and payment method
    await this.invoiceRepository.update(id, {
      status: InvoiceStatus.PAID,
      paymentMethod:
        paymentMethod ?? invoice.paymentMethod ?? PaymentMethod.CASH,
    });

    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(
        `Invoice with id ${id} not found after payment`,
      );
    }
    return updated;
  }

  async markAsVoid(id: number): Promise<Invoice> {
    return this.updateInvoice(id, {
      status: InvoiceStatus.CANCELLED,
    });
  }

  async generateMonthlyReport(
    year: number,
    month: number,
  ): Promise<{
    totalInvoices: number;
    totalRevenue: number;
    paidInvoices: number;
    pendingInvoices: number;
    overdueInvoices: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const summary = await this.getFinancialSummary(startDate, endDate);

    return {
      totalInvoices: summary.totalPaidInvoices + summary.totalPendingInvoices,
      totalRevenue: summary.totalRevenue,
      paidInvoices: summary.totalPaidInvoices,
      pendingInvoices: summary.totalPendingInvoices,
      overdueInvoices: summary.totalOverdueInvoices,
    };
  }

  async remove(id: number): Promise<Invoice> {
    const invoice = await this.findOne(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    await this.invoiceRepository.remove(invoice);
    return invoice;
  }

  async getAllPayments(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  async getPaymentStatistics(): Promise<PaymentStatisticsResponseDto> {
    const payments = await this.paymentRepository.find();

    const totalPayments = payments.length;
    const totalAmount = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0,
    );
    const averagePayment = totalPayments > 0 ? totalAmount / totalPayments : 0;
    const completedPayments = payments.filter(
      (p) => p.status === PaymentStatus.COMPLETED,
    ).length;
    const pendingPayments = payments.filter(
      (p) => p.status === PaymentStatus.PENDING,
    ).length;

    return {
      totalPayments,
      totalAmount,
      averagePayment,
      completedPayments,
      pendingPayments,
    };
  }

  async getPaymentsByInvoiceId(invoiceId: number): Promise<Payment[]> {
    return this.paymentRepository.find({
      where: { invoiceId },
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
    });
  }

  async generateInvoicePdf(id: number): Promise<StreamableFile> {
    const invoice = await this.findOne(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));

      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        const file = new StreamableFile(result, {
          type: 'application/pdf',
          disposition: `attachment; filename="invoice-${invoice.number}.pdf"`,
        });
        resolve(file);
      });

      doc.on('error', reject);

      // Header

      doc.fontSize(20).text('HOTELIER', { align: 'center' });

      doc.fontSize(16).text('INVOICE', { align: 'center' });

      doc.moveDown();

      // Invoice details

      doc.fontSize(12);

      doc.text(`Invoice Number: ${invoice.number}`);

      doc.text(`Date: ${invoice.createdAt.toLocaleDateString()}`);

      doc.text(`Status: ${invoice.status}`);

      doc.moveDown();

      // Guest details

      doc.text(`Customer: ${invoice.guestName}`);

      doc.moveDown();

      // Items

      doc.text('DETAILS', { align: 'left' });

      doc.moveDown(0.5);
      invoice.invoiceItems?.forEach((item) => {
        const itemTotal = Number(item.quantity || 0) * Number(item.price || 0);

        doc.text(
          `${item.description} x ${item.quantity} = $${itemTotal.toFixed(2)}`,
        );
      });

      doc.moveDown();

      // Totals

      doc.fontSize(14);

      doc.text(`Subtotal: $${Number(invoice.subtotal).toFixed(2)}`);

      doc.text(`Tax: $${Number(invoice.taxes).toFixed(2)}`);

      doc.text(`Total: $${Number(invoice.total).toFixed(2)}`);

      // Footer

      doc.moveDown(2);

      doc.fontSize(10);

      doc.text('Thank you for your preference', { align: 'center' });

      // Finish

      doc.end();
    });
  }
}
