import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE_CLIENT } from '../constants';
import { PAYMENTS_PATTERNS } from '@app/contracts/billing-service/payments/payments.patterns';
import {
  PaymentDto,
  CreatePaymentDto,
} from '@app/contracts/billing-service/payments/dto';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(BILLING_SERVICE_CLIENT)
    private readonly billingClient: ClientProxy,
  ) {}

  findAll(): Observable<PaymentDto[]> {
    return this.billingClient.send<PaymentDto[], Record<string, never>>(
      PAYMENTS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<PaymentDto> {
    return this.billingClient.send<PaymentDto, number>(
      PAYMENTS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreatePaymentDto): Observable<PaymentDto> {
    return this.billingClient.send<PaymentDto, CreatePaymentDto>(
      PAYMENTS_PATTERNS.CREATE,
      data,
    );
  }

  findByInvoice(invoiceId: number): Observable<PaymentDto[]> {
    return this.billingClient.send<PaymentDto[], number>(
      PAYMENTS_PATTERNS.FIND_BY_INVOICE,
      invoiceId,
    );
  }
}
