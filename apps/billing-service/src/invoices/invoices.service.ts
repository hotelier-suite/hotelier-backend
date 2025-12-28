import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  Between,
  FindOptionsSelect,
  FindOptionsRelations,
} from 'typeorm';
import { Invoice, InvoiceItem } from './entities';
import { Payment } from '../payments/entities';
import {
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  InvoiceDto,
  InvoicePdfDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  FindInvoicesFilterDto,
} from '@app/contracts/billing-service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private readonly invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  private readonly invoiceReadSelect: FindOptionsSelect<Invoice> = {
    id: true,
    number: true,
    guestName: true,
    issueDate: true,
    dueDate: true,
    subtotal: true,
    taxes: true,
    total: true,
    currency: true,
    status: true,
    paymentMethod: true,
    reservationId: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    invoiceItems: {
      id: true,
      description: true,
      quantity: true,
      price: true,
      total: true,
      invoiceId: true,
    },
  };

  private readonly invoiceReadRelations: FindOptionsRelations<Invoice> = {
    invoiceItems: true,
  };

  findAll(filters: FindInvoicesFilterDto): Promise<InvoiceDto[]> {
    return this.invoiceRepository.find({
      where: {
        ...filters,
        ...(filters.startDate &&
          filters.endDate && {
            createdAt: Between(filters.startDate, filters.endDate),
          }),
      },
      select: this.invoiceReadSelect,
      relations: this.invoiceReadRelations,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      select: this.invoiceReadSelect,
      relations: this.invoiceReadRelations,
    });

    if (!invoice) {
      throw new RpcException({
        statusCode: 404,
        message: `Invoice with id ${id} not found`,
      });
    }

    return invoice;
  }

  async create(data: CreateInvoiceDto): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.save({
      ...data,
      number: `INV-${Date.now()}`,
      status: data.status ?? InvoiceStatus.PENDING,
      currency: data.currency ?? 'COP',
    });

    const loaded = await this.invoiceRepository.findOne({
      where: { id: invoice.id },
      select: this.invoiceReadSelect,
      relations: this.invoiceReadRelations,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load invoice with id ${invoice.id} after creation`,
      });
    }

    return loaded;
  }

  async update(id: number, data: UpdateInvoiceDto): Promise<InvoiceDto> {
    const existing = await this.invoiceRepository.findOne({ where: { id } });

    if (!existing) {
      throw new RpcException({
        statusCode: 404,
        message: `Invoice with id ${id} not found`,
      });
    }

    await this.invoiceRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      select: this.invoiceReadSelect,
      relations: this.invoiceReadRelations,
    });

    if (!invoice) {
      throw new RpcException({
        statusCode: 404,
        message: `Invoice with id ${id} not found`,
      });
    }

    await this.invoiceRepository.remove(invoice);
    return invoice;
  }

  async markAsPaid(
    id: number,
    paymentMethod?: PaymentMethod,
  ): Promise<InvoiceDto> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      select: this.invoiceReadSelect,
      relations: this.invoiceReadRelations,
    });

    if (!invoice) {
      throw new RpcException({
        statusCode: 404,
        message: `Invoice with id ${id} not found`,
      });
    }

    await this.paymentRepository.save({
      reference: `PAY-${Date.now()}-${id}`,
      amount: invoice.total,
      method: paymentMethod ?? PaymentMethod.CASH,
      status: PaymentStatus.COMPLETED,
      invoiceId: invoice.id,
    });

    await this.invoiceRepository.update(id, {
      status: InvoiceStatus.PAID,
      paymentMethod:
        paymentMethod ?? invoice.paymentMethod ?? PaymentMethod.CASH,
    });

    return this.findOne(id);
  }

  async generatePdf(id: number): Promise<InvoicePdfDto> {
    const invoice = await this.findOne(id);
    const buffer = await this.buildInvoicePdf(invoice);
    const filename = `invoice-${invoice.number}.pdf`;
    return { buffer, filename };
  }

  private buildInvoicePdf(invoice: InvoiceDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text('HOTELIER', { align: 'center' });
      doc.fontSize(16).text('INVOICE', { align: 'center' });
      doc.moveDown();

      doc.fontSize(12);
      doc.text(`Invoice Number: ${invoice.number}`);
      doc.text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`);
      doc.text(`Status: ${invoice.status}`);
      doc.moveDown();

      doc.text(`Customer: ${invoice.guestName}`);
      doc.moveDown();

      doc.text('DETAILS', { align: 'left' });
      doc.moveDown(0.5);
      invoice.invoiceItems?.forEach((item) => {
        const itemTotal = Number(item.quantity || 0) * Number(item.price || 0);
        doc.text(
          `${item.description} x ${item.quantity} = ${itemTotal.toFixed(2)}`,
        );
      });
      doc.moveDown();

      doc.fontSize(14);
      doc.text(`Subtotal: ${Number(invoice.subtotal).toFixed(2)}`);
      doc.text(`Tax: ${Number(invoice.taxes).toFixed(2)}`);
      doc.text(`Total: ${Number(invoice.total).toFixed(2)}`);

      doc.moveDown(2);
      doc.fontSize(10);
      doc.text('Thank you for your preference', { align: 'center' });

      doc.end();
    });
  }
}
