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
  CreateInvoiceDto,
  UpdateInvoiceDto,
} from '@app/contracts/billing-service';

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

  findAll(
    status?: InvoiceStatus,
    startDate?: Date,
    endDate?: Date,
  ): Promise<InvoiceDto[]> {
    return this.invoiceRepository.find({
      where: {
        status,
        createdAt:
          startDate && endDate ? Between(startDate, endDate) : undefined,
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

  findByCustomer(userId: number): Promise<InvoiceDto[]> {
    return this.invoiceRepository.find({
      where: { userId },
      select: this.invoiceReadSelect,
      relations: this.invoiceReadRelations,
      order: { createdAt: 'DESC' },
    });
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

  download(id: number): Promise<InvoiceDto> {
    return this.findOne(id);
  }
}
