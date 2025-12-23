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
} from '@app/contracts/billing-service/statistics/dto';

@ApiTags('billing')
@Controller('billing')
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('invoices/statistics')
  @ApiOperation({
    summary: 'Get Billing Statistics',
    description: 'Retrieve comprehensive billing statistics.',
  })
  @ApiResponse({
    status: 200,
    description: 'Billing statistics retrieved successfully',
    type: FinancialSummaryResponseDto,
  })
  getBillingStatistics(): Observable<FinancialSummaryResponseDto> {
    const startDate = new Date(new Date().getFullYear(), 0, 1).toISOString();
    const endDate = new Date().toISOString();
    return this.statisticsService.getFinancialSummary(startDate, endDate);
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
