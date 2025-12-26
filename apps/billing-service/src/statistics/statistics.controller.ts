import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StatisticsService } from './statistics.service';
import {
  STATISTICS_PATTERNS,
  FinancialSummaryResponseDto,
  PaymentStatisticsResponseDto,
} from '@app/contracts/billing-service';

@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @MessagePattern(STATISTICS_PATTERNS.YEAR_TO_DATE_SUMMARY)
  getYearToDateFinancialSummary(): Promise<FinancialSummaryResponseDto> {
    return this.statisticsService.getYearToDateFinancialSummary();
  }

  @MessagePattern(STATISTICS_PATTERNS.FINANCIAL_SUMMARY)
  getFinancialSummary(
    @Payload() payload: { startDate: Date; endDate: Date },
  ): Promise<FinancialSummaryResponseDto> {
    return this.statisticsService.getFinancialSummary(
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(STATISTICS_PATTERNS.PAYMENTS)
  getPaymentStatistics(): Promise<PaymentStatisticsResponseDto> {
    return this.statisticsService.getPaymentStatistics();
  }
}
