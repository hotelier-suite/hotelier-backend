import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import { Payment } from './entities';
import {
  PaymentStatus,
  PaymentDto,
  CreatePaymentDto,
} from '@app/contracts/billing-service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  private readonly paymentReadSelect: FindOptionsSelect<Payment> = {
    id: true,
    reference: true,
    amount: true,
    method: true,
    status: true,
    notes: true,
    processedAt: true,
    invoiceId: true,
    createdAt: true,
    updatedAt: true,
  };

  findAll(): Promise<PaymentDto[]> {
    return this.paymentRepository.find({
      select: this.paymentReadSelect,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      select: this.paymentReadSelect,
    });

    if (!payment) {
      throw new RpcException({
        statusCode: 404,
        message: `Payment with id ${id} not found`,
      });
    }

    return payment;
  }

  async create(data: CreatePaymentDto): Promise<PaymentDto> {
    const payment = await this.paymentRepository.save({
      ...data,
      reference: `PAY-${Date.now()}`,
      status: data.status ?? PaymentStatus.COMPLETED,
      processedAt: data.processedAt ?? new Date(),
    });

    const loaded = await this.paymentRepository.findOne({
      where: { id: payment.id },
      select: this.paymentReadSelect,
    });

    if (!loaded) {
      throw new RpcException({
        statusCode: 500,
        message: `Failed to load payment with id ${payment.id} after creation`,
      });
    }

    return loaded;
  }

  findByInvoice(invoiceId: number): Promise<PaymentDto[]> {
    return this.paymentRepository.find({
      where: { invoiceId },
      select: this.paymentReadSelect,
      order: { createdAt: 'DESC' },
    });
  }
}
