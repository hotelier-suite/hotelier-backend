import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE_CLIENT } from '../constants';
import {
  PAYMENTS_PATTERNS,
  PaymentDto,
  CreatePaymentDto,
  FindPaymentsFilterDto,
} from '@app/contracts/billing-service';

@Injectable()
export class PaymentsService {
  constructor(
    @Inject(BILLING_SERVICE_CLIENT)
    private readonly billingClient: ClientProxy,
  ) {}

  findAll(filters: FindPaymentsFilterDto): Observable<PaymentDto[]> {
    return this.billingClient.send<PaymentDto[], FindPaymentsFilterDto>(
      PAYMENTS_PATTERNS.FIND_ALL,
      filters,
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
}
