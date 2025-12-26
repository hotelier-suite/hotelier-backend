import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE_CLIENT } from '../constants';
import {
  STATISTICS_PATTERNS,
  FinancialSummaryResponseDto,
  PaymentStatisticsResponseDto,
} from '@app/contracts/billing-service';

@Injectable()
export class StatisticsService {
  constructor(
    @Inject(BILLING_SERVICE_CLIENT)
    private readonly billingClient: ClientProxy,
  ) {}

  getYearToDateFinancialSummary(): Observable<FinancialSummaryResponseDto> {
    return this.billingClient.send<
      FinancialSummaryResponseDto,
      Record<string, never>
    >(STATISTICS_PATTERNS.YEAR_TO_DATE_SUMMARY, {});
  }

  getPaymentStatistics(): Observable<PaymentStatisticsResponseDto> {
    return this.billingClient.send<
      PaymentStatisticsResponseDto,
      Record<string, never>
    >(STATISTICS_PATTERNS.PAYMENTS, {});
  }
}
