import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThan } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { InvoiceItem } from './entities/invoice-item.entity';
import { Payment } from './entities/payment.entity';
import { InvoiceStatus } from '@app/contracts/billing-service/invoices/enums/invoice-status.enum';
import { PaymentMethod } from '@app/contracts/billing-service/payments/enums/payment-method.enum';
import { PaymentStatus } from '@app/contracts/billing-service/payments/enums/payment-status.enum';
import {
  InvoiceDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from '@app/contracts/billing-service/invoices/dto';
import {
  PaymentDto,
  CreatePaymentDto,
} from '@app/contracts/billing-service/payments/dto';
import {
  FinancialSummaryResponseDto,
  PaymentStatisticsResponseDto,
  MonthlyReportResponseDto,
} from '@app/contracts/billing-service/statistics/dto';

interface InvoiceTotalResultInterface {
  total: string;
}

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  // Invoice methods
  async findAllInvoices(): Promise<InvoiceDto[]> {
    const invoices = await this.invoiceRepository.find({
      relations: ['invoiceItems'],
      order: { createdAt: 'DESC' },
    });
    return invoices.map((invoice) => this.toInvoiceDto(invoice));
  }

  async findOneInvoice(id: number): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['invoiceItems'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    return this.toInvoiceDto(invoice);
  }

  async createInvoice(data: CreateInvoiceDto): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.save({
      ...data,
      number: `INV-${Date.now()}`,
      status: data.status ?? InvoiceStatus.PENDING,
      currency: data.currency ?? 'COP',
    });
    return this.toInvoiceDto(invoice);
  }

  async updateInvoice(id: number, data: UpdateInvoiceDto): Promise<InvoiceDto> {
    const existing = await this.invoiceRepository.findOne({ where: { id } });
    if (!existing) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    await this.invoiceRepository.update(id, data);
    return this.findOneInvoice(id);
  }

  async deleteInvoice(id: number): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['invoiceItems'],
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    const dto = this.toInvoiceDto(invoice);
    await this.invoiceRepository.remove(invoice);
    return dto;
  }

  async findInvoicesByStatus(status: InvoiceStatus): Promise<InvoiceDto[]> {
    const invoices = await this.invoiceRepository.find({
      where: { status },
      relations: ['invoiceItems'],
      order: { dueDate: 'ASC' },
    });
    return invoices.map((invoice) => this.toInvoiceDto(invoice));
  }

  async findInvoicesByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<InvoiceDto[]> {
    const invoices = await this.invoiceRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['invoiceItems'],
      order: { createdAt: 'DESC' },
    });
    return invoices.map((invoice) => this.toInvoiceDto(invoice));
  }

  async findOverdueInvoices(): Promise<InvoiceDto[]> {
    const now = new Date();
    const invoices = await this.invoiceRepository.find({
      where: {
        status: InvoiceStatus.PENDING,
        dueDate: LessThan(now),
      },
      relations: ['invoiceItems'],
      order: { dueDate: 'ASC' },
    });
    return invoices.map((invoice) => this.toInvoiceDto(invoice));
  }

  async findInvoicesByCustomer(userId: number): Promise<InvoiceDto[]> {
    const invoices = await this.invoiceRepository.find({
      where: { userId },
      relations: ['invoiceItems'],
      order: { createdAt: 'DESC' },
    });
    return invoices.map((invoice) => this.toInvoiceDto(invoice));
  }

  async markAsPaid(
    id: number,
    paymentMethod?: PaymentMethod,
  ): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['invoiceItems'],
    });
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
      paymentMethod: paymentMethod ?? invoice.paymentMethod ?? PaymentMethod.CASH,
    });

    return this.findOneInvoice(id);
  }

  async generateInvoicePdfData(id: number): Promise<InvoiceDto> {
    return this.findOneInvoice(id);
  }

  // Payment methods
  async findAllPayments(): Promise<PaymentDto[]> {
    const payments = await this.paymentRepository.find({
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
    });
    return payments.map((payment) => this.toPaymentDto(payment));
  }

  async findOnePayment(id: number): Promise<PaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['invoice'],
    });
    if (!payment) {
      throw new NotFoundException(`Payment with id ${id} not found`);
    }
    return this.toPaymentDto(payment);
  }

  async createPayment(data: CreatePaymentDto): Promise<PaymentDto> {
    const payment = await this.paymentRepository.save({
      ...data,
      reference: `PAY-${Date.now()}`,
      status: data.status ?? PaymentStatus.COMPLETED,
      processedAt: data.processedAt ?? new Date(),
    });
    return this.toPaymentDto(payment);
  }

  async findPaymentsByInvoice(invoiceId: number): Promise<PaymentDto[]> {
    const payments = await this.paymentRepository.find({
      where: { invoiceId },
      relations: ['invoice'],
      order: { createdAt: 'DESC' },
    });
    return payments.map((payment) => this.toPaymentDto(payment));
  }

  // Statistics methods
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

  async generateMonthlyReport(
    year: number,
    month: number,
  ): Promise<MonthlyReportResponseDto> {
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

  // DTO Converters
  private toInvoiceDto(invoice: Invoice): InvoiceDto {
    return {
      id: invoice.id,
      number: invoice.number,
      guestName: invoice.guestName,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      subtotal: Number(invoice.subtotal),
      taxes: Number(invoice.taxes),
      total: Number(invoice.total),
      currency: invoice.currency,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod,
      reservationId: invoice.reservationId,
      userId: invoice.userId,
      invoiceItems: (invoice.invoiceItems || []).map((item) => ({
        id: item.id,
        description: item.description,
        quantity: item.quantity,
        price: Number(item.price),
        total: Number(item.total),
        invoiceId: item.invoiceId,
      })),
      createdAt: invoice.createdAt,
      updatedAt: invoice.updatedAt,
    };
  }

  private toPaymentDto(payment: Payment): PaymentDto {
    return {
      id: payment.id,
      reference: payment.reference,
      amount: Number(payment.amount),
      method: payment.method,
      status: payment.status,
      notes: payment.notes,
      processedAt: payment.processedAt,
      invoiceId: payment.invoiceId,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    };
  }
}
