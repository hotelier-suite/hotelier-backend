import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StatisticsService } from './statistics.service';
import {
  HOUSEKEEPING_STATISTICS_PATTERNS,
  HousekeepingStatisticsDto,
  CleaningPerformanceDto,
} from '@app/contracts/operations-service';

@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @MessagePattern(HOUSEKEEPING_STATISTICS_PATTERNS.GET_STATISTICS)
  getStatistics(): Promise<HousekeepingStatisticsDto> {
    return this.statisticsService.getStatistics();
  }

  @MessagePattern(HOUSEKEEPING_STATISTICS_PATTERNS.GET_CLEANING_PERFORMANCE)
  getCleaningPerformance(
    @Payload() employeeId?: number,
  ): Promise<CleaningPerformanceDto> {
    return this.statisticsService.getCleaningPerformance(employeeId);
  }
}
