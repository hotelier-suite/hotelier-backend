import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { StatisticsService } from './statistics.service';
import {
  HousekeepingStatisticsDto,
  CleaningPerformanceDto,
} from '@app/contracts/operations-service';

@ApiTags('Housekeeping Statistics')
@Controller('housekeeping')
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @ApiOperation({
    summary: 'Get housekeeping statistics',
    description:
      'Retrieve overall housekeeping statistics including room cleaning status, task completion rates, and staff performance metrics. Provides a high-level overview of housekeeping operations.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved housekeeping statistics',
    type: HousekeepingStatisticsDto,
  })
  @Get('statistics')
  getStatistics(): Observable<HousekeepingStatisticsDto> {
    return this.statisticsService.getStatistics();
  }

  @ApiOperation({
    summary: 'Get cleaning performance',
    description:
      'Retrieve cleaning performance metrics for housekeeping staff. Can be filtered by employee to get individual performance data, or retrieve aggregate performance across all staff.',
  })
  @ApiQuery({
    name: 'employeeId',
    type: 'number',
    required: false,
    description:
      'Filter performance data by a specific employee ID. If not provided, returns aggregate performance for all staff.',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved cleaning performance',
    type: CleaningPerformanceDto,
  })
  @Get('cleaning-performance')
  getCleaningPerformance(
    @Query('employeeId', new ParseIntPipe({ optional: true }))
    employeeId?: number,
  ): Observable<CleaningPerformanceDto> {
    return this.statisticsService.getCleaningPerformance(employeeId);
  }
}
