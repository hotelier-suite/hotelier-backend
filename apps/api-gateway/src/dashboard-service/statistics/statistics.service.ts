import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { DASHBOARD_SERVICE_CLIENT } from '../constants';
import {
  DASHBOARD_STATISTICS_PATTERNS,
  DashboardStatsDto,
  DashboardOccupancyDataDto,
  RevenueDataDto,
  TopPerformingRoomDto,
  RecentActivityDto,
} from '@app/contracts/dashboard-service';

@Injectable()
export class StatisticsService {
  constructor(
    @Inject(DASHBOARD_SERVICE_CLIENT)
    private readonly dashboardClient: ClientProxy,
  ) {}

  getStats(userId: number): Observable<DashboardStatsDto> {
    return this.dashboardClient.send<DashboardStatsDto, number>(
      DASHBOARD_STATISTICS_PATTERNS.GET_STATS,
      userId,
    );
  }

  getOccupancy(): Observable<DashboardOccupancyDataDto[]> {
    return this.dashboardClient.send<
      DashboardOccupancyDataDto[],
      Record<string, never>
    >(DASHBOARD_STATISTICS_PATTERNS.GET_OCCUPANCY, {});
  }

  getRevenue(userId: number): Observable<RevenueDataDto[]> {
    return this.dashboardClient.send<RevenueDataDto[], number>(
      DASHBOARD_STATISTICS_PATTERNS.GET_REVENUE,
      userId,
    );
  }

  getTopRooms(): Observable<TopPerformingRoomDto[]> {
    return this.dashboardClient.send<
      TopPerformingRoomDto[],
      Record<string, never>
    >(DASHBOARD_STATISTICS_PATTERNS.GET_TOP_ROOMS, {});
  }

  getRecentActivities(userId: number): Observable<RecentActivityDto[]> {
    return this.dashboardClient.send<RecentActivityDto[], number>(
      DASHBOARD_STATISTICS_PATTERNS.GET_RECENT_ACTIVITIES,
      userId,
    );
  }
}
