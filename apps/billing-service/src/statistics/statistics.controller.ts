import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StatisticsService } from './statistics.service';
import {
  STATISTICS_PATTERNS,
  FinancialSummaryResponseDto,
  PaymentStatisticsResponseDto,
  MonthlyReportResponseDto,
} from '@app/contracts/billing-service';

@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @MessagePattern(STATISTICS_PATTERNS.FINANCIAL_SUMMARY)
  getFinancialSummary(
    @Payload() payload: { startDate: string; endDate: string },
  ): Promise<FinancialSummaryResponseDto> {
    return this.statisticsService.getFinancialSummary(
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }

  @MessagePattern(STATISTICS_PATTERNS.PAYMENTS)
  getPaymentStatistics(): Promise<PaymentStatisticsResponseDto> {
    return this.statisticsService.getPaymentStatistics();
  }

  @MessagePattern(STATISTICS_PATTERNS.MONTHLY_REPORT)
  generateMonthlyReport(
    @Payload() payload: { year: number; month: number },
  ): Promise<MonthlyReportResponseDto> {
    return this.statisticsService.generateMonthlyReport(
      payload.year,
      payload.month,
    );
  }
}
