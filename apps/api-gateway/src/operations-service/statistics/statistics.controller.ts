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

  @ApiOperation({ summary: 'Get housekeeping statistics' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved housekeeping statistics',
    type: HousekeepingStatisticsDto,
  })
  @Get('statistics')
  getStatistics(): Observable<HousekeepingStatisticsDto> {
    return this.statisticsService.getStatistics();
  }

  @ApiOperation({ summary: 'Get cleaning performance' })
  @ApiQuery({
    name: 'employeeId',
    type: 'number',
    required: false,
    description: 'Optional employee ID to filter by',
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
