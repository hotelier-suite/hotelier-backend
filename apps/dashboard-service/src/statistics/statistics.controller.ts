import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { StatisticsService } from './statistics.service';
import {
  DASHBOARD_STATISTICS_PATTERNS,
  DashboardStatsDto,
  DashboardOccupancyDataDto,
  RevenueDataDto,
  RecentActivityDto,
  TopPerformingRoomDto,
} from '@app/contracts/dashboard-service';

@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @MessagePattern(DASHBOARD_STATISTICS_PATTERNS.GET_STATS)
  getStats(@Payload() userId: number): Promise<DashboardStatsDto> {
    return this.statisticsService.getStats(userId);
  }

  @MessagePattern(DASHBOARD_STATISTICS_PATTERNS.GET_OCCUPANCY)
  getOccupancy(): Promise<DashboardOccupancyDataDto[]> {
    return this.statisticsService.getOccupancy();
  }

  @MessagePattern(DASHBOARD_STATISTICS_PATTERNS.GET_REVENUE)
  getRevenue(@Payload() userId: number): Promise<RevenueDataDto[]> {
    return this.statisticsService.getRevenue(userId);
  }

  @MessagePattern(DASHBOARD_STATISTICS_PATTERNS.GET_TOP_ROOMS)
  getTopRooms(): Promise<TopPerformingRoomDto[]> {
    return this.statisticsService.getTopRooms();
  }

  @MessagePattern(DASHBOARD_STATISTICS_PATTERNS.GET_RECENT_ACTIVITIES)
  getRecentActivities(@Payload() userId: number): Promise<RecentActivityDto[]> {
    return this.statisticsService.getRecentActivities(userId);
  }
}
