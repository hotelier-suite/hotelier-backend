import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { StatisticsService } from './statistics.service';
import {
  FinancialSummaryResponseDto,
  PaymentStatisticsResponseDto,
} from '@app/contracts/billing-service';

@ApiTags('billing')
@Controller('billing')
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('invoices/statistics')
  @ApiOperation({
    summary: 'Get Billing Statistics',
    description: 'Retrieve year-to-date billing statistics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Billing statistics retrieved successfully',
    type: FinancialSummaryResponseDto,
  })
  getYearToDateFinancialSummary(): Observable<FinancialSummaryResponseDto> {
    return this.statisticsService.getYearToDateFinancialSummary();
  }

  @Get('payments/statistics')
  @ApiOperation({
    summary: 'Get Payment Statistics',
    description: 'Retrieve payment statistics and analytics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Payment statistics retrieved successfully',
    type: PaymentStatisticsResponseDto,
  })
  getPaymentStatistics(): Observable<PaymentStatisticsResponseDto> {
    return this.statisticsService.getPaymentStatistics();
  }
}
