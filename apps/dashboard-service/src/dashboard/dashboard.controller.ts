import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { DashboardService } from './dashboard.service';
import { WIDGETS_PATTERNS } from '@app/contracts/dashboard-service/widgets/widgets.patterns';
import { STATISTICS_PATTERNS } from '@app/contracts/dashboard-service/statistics/statistics.patterns';
import {
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardWidgetDto,
  DashboardStatsDto,
  OccupancyDataDto,
  RevenueDataDto,
  RecentActivityDto,
  TopPerformingRoomDto,
} from '@app/contracts/dashboard-service';

@Controller()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  // Widget patterns
  @MessagePattern(WIDGETS_PATTERNS.CREATE)
  createWidget(@Payload() data: CreateDashboardWidgetDto): Promise<DashboardWidgetDto> {
    return this.dashboardService.createWidget(data);
  }

  @MessagePattern(WIDGETS_PATTERNS.FIND_ALL)
  findAllWidgets(): Promise<DashboardWidgetDto[]> {
    return this.dashboardService.findAllWidgets();
  }

  @MessagePattern(WIDGETS_PATTERNS.FIND_ONE)
  findOneWidget(@Payload() id: number): Promise<DashboardWidgetDto> {
    return this.dashboardService.findOneWidget(id);
  }

  @MessagePattern(WIDGETS_PATTERNS.UPDATE)
  updateWidget(
    @Payload() payload: { id: number; data: UpdateDashboardWidgetDto },
  ): Promise<DashboardWidgetDto> {
    return this.dashboardService.updateWidget(payload.id, payload.data);
  }

  @MessagePattern(WIDGETS_PATTERNS.DELETE)
  deleteWidget(@Payload() id: number): Promise<DashboardWidgetDto> {
    return this.dashboardService.deleteWidget(id);
  }

  @MessagePattern(WIDGETS_PATTERNS.FIND_BY_USER)
  findWidgetsByUser(@Payload() userId: number): Promise<DashboardWidgetDto[]> {
    return this.dashboardService.findWidgetsByUser(userId);
  }

  // Statistics patterns
  @MessagePattern(STATISTICS_PATTERNS.GET_STATS)
  getDashboardStats(@Payload() userId: number): Promise<DashboardStatsDto> {
    return this.dashboardService.getDashboardStats(userId);
  }

  @MessagePattern(STATISTICS_PATTERNS.GET_OCCUPANCY)
  getOccupancyData(): Promise<OccupancyDataDto[]> {
    return this.dashboardService.getOccupancyData();
  }

  @MessagePattern(STATISTICS_PATTERNS.GET_REVENUE)
  getRevenueData(@Payload() userId: number): Promise<RevenueDataDto[]> {
    return this.dashboardService.getRevenueData(userId);
  }

  @MessagePattern(STATISTICS_PATTERNS.GET_TOP_ROOMS)
  getTopPerformingRooms(): Promise<TopPerformingRoomDto[]> {
    return this.dashboardService.getTopPerformingRooms();
  }

  @MessagePattern(STATISTICS_PATTERNS.GET_RECENT_ACTIVITIES)
  getRecentActivities(@Payload() userId: number): Promise<RecentActivityDto[]> {
    return this.dashboardService.getRecentActivities(userId);
  }
}
