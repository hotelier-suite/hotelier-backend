import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DASHBOARD_SERVICE_CLIENT } from '../constants';
import {
  WIDGETS_PATTERNS,
  STATISTICS_PATTERNS,
  CreateDashboardWidgetDto,
  UpdateDashboardWidgetDto,
  DashboardWidgetDto,
  DashboardStatsDto,
  OccupancyDataDto,
  RevenueDataDto,
  RecentActivityDto,
  TopPerformingRoomDto,
} from '@app/contracts/dashboard-service';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(DASHBOARD_SERVICE_CLIENT)
    private readonly dashboardClient: ClientProxy,
  ) {}

  // Widget operations
  createWidget(data: CreateDashboardWidgetDto): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<
      DashboardWidgetDto,
      CreateDashboardWidgetDto
    >(WIDGETS_PATTERNS.CREATE, data);
  }

  findAllWidgets(): Observable<DashboardWidgetDto[]> {
    return this.dashboardClient.send<
      DashboardWidgetDto[],
      Record<string, never>
    >(WIDGETS_PATTERNS.FIND_ALL, {});
  }

  findOneWidget(id: number): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<DashboardWidgetDto, number>(
      WIDGETS_PATTERNS.FIND_ONE,
      id,
    );
  }

  updateWidget(
    id: number,
    data: UpdateDashboardWidgetDto,
  ): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<
      DashboardWidgetDto,
      { id: number; data: UpdateDashboardWidgetDto }
    >(WIDGETS_PATTERNS.UPDATE, { id, data });
  }

  deleteWidget(id: number): Observable<DashboardWidgetDto> {
    return this.dashboardClient.send<DashboardWidgetDto, number>(
      WIDGETS_PATTERNS.DELETE,
      id,
    );
  }

  findWidgetsByUser(userId: number): Observable<DashboardWidgetDto[]> {
    return this.dashboardClient.send<DashboardWidgetDto[], number>(
      WIDGETS_PATTERNS.FIND_BY_USER,
      userId,
    );
  }

  // Statistics operations
  getDashboardStats(userId: number): Observable<DashboardStatsDto> {
    return this.dashboardClient.send<DashboardStatsDto, number>(
      STATISTICS_PATTERNS.GET_STATS,
      userId,
    );
  }

  getOccupancyData(): Observable<OccupancyDataDto[]> {
    return this.dashboardClient.send<OccupancyDataDto[], Record<string, never>>(
      STATISTICS_PATTERNS.GET_OCCUPANCY,
      {},
    );
  }

  getRevenueData(userId: number): Observable<RevenueDataDto[]> {
    return this.dashboardClient.send<RevenueDataDto[], number>(
      STATISTICS_PATTERNS.GET_REVENUE,
      userId,
    );
  }

  getTopPerformingRooms(): Observable<TopPerformingRoomDto[]> {
    return this.dashboardClient.send<
      TopPerformingRoomDto[],
      Record<string, never>
    >(STATISTICS_PATTERNS.GET_TOP_ROOMS, {});
  }

  getRecentActivities(userId: number): Observable<RecentActivityDto[]> {
    return this.dashboardClient.send<RecentActivityDto[], number>(
      STATISTICS_PATTERNS.GET_RECENT_ACTIVITIES,
      userId,
    );
  }
}
