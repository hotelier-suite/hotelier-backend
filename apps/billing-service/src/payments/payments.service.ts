import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsSelect } from 'typeorm';
import { Payment } from './entities';
import {
  PaymentDto,
  CreatePaymentDto,
  FindPaymentsFilterDto,
} from '@app/contracts/billing-service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
  ) {}

  private readonly paymentSelect: FindOptionsSelect<Payment> = {
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

  findAll(filters: FindPaymentsFilterDto): Promise<PaymentDto[]> {
    return this.paymentRepository.find({
      where: filters,
      select: this.paymentSelect,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<PaymentDto> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      select: this.paymentSelect,
    });

    if (!payment) {
      throw new RpcException({
        statusCode: 404,
        message: `Payment with id ${id} not found`,
      });
    }

    return payment;
  }

  create(data: CreatePaymentDto): Promise<PaymentDto> {
    const entity = this.paymentRepository.create(data);
    return this.paymentRepository.save(entity);
  }
}
