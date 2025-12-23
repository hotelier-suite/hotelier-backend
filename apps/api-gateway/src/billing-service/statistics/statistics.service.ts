import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BILLING_SERVICE_CLIENT } from '../constants';
import { STATISTICS_PATTERNS } from '@app/contracts/billing-service/statistics/statistics.patterns';
import {
  FinancialSummaryResponseDto,
  PaymentStatisticsResponseDto,
  MonthlyReportResponseDto,
} from '@app/contracts/billing-service/statistics/dto';

@Injectable()
export class StatisticsService {
  constructor(
    @Inject(BILLING_SERVICE_CLIENT)
    private readonly billingClient: ClientProxy,
  ) {}

  getFinancialSummary(
    startDate: string,
    endDate: string,
  ): Observable<FinancialSummaryResponseDto> {
    return this.billingClient.send<
      FinancialSummaryResponseDto,
      { startDate: string; endDate: string }
    >(STATISTICS_PATTERNS.FINANCIAL_SUMMARY, { startDate, endDate });
  }

  getPaymentStatistics(): Observable<PaymentStatisticsResponseDto> {
    return this.billingClient.send<
      PaymentStatisticsResponseDto,
      Record<string, never>
    >(STATISTICS_PATTERNS.PAYMENTS, {});
  }

  generateMonthlyReport(
    year: number,
    month: number,
  ): Observable<MonthlyReportResponseDto> {
    return this.billingClient.send<
      MonthlyReportResponseDto,
      { year: number; month: number }
    >(STATISTICS_PATTERNS.MONTHLY_REPORT, { year, month });
  }
}
