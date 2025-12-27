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
  DashboardStatsDto,
  DashboardOccupancyDataDto,
  RevenueDataDto,
  TopPerformingRoomDto,
  RecentActivityDto,
} from '@app/contracts/dashboard-service';
import { CurrentUserId } from '../../common';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';

@ApiTags('dashboard')
@Controller('dashboard')
@AuditLog({ resource: AuditResource.ANALYTICS })
@ApiBearerAuth()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('stats')
  @ApiOperation({
    summary: 'Get Dashboard Statistics',
    description:
      'Retrieve key statistics for the hotel dashboard including room occupancy, revenue, and activity counts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard statistics retrieved successfully',
    type: DashboardStatsDto,
  })
  getStats(@CurrentUserId() userId: number): Observable<DashboardStatsDto> {
    return this.statisticsService.getStats(userId);
  }

  @Get('occupancy')
  @ApiOperation({
    summary: 'Get Occupancy Data',
    description: 'Retrieve room occupancy data for dashboard visualization.',
  })
  @ApiResponse({
    status: 200,
    description: 'Occupancy data retrieved successfully',
    type: [DashboardOccupancyDataDto],
  })
  getOccupancy(): Observable<DashboardOccupancyDataDto[]> {
    return this.statisticsService.getOccupancy();
  }

  @Get('revenue')
  @ApiOperation({
    summary: 'Get Revenue Data',
    description:
      'Retrieve daily revenue data for the past week for dashboard charts.',
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue data retrieved successfully',
    type: [RevenueDataDto],
  })
  getRevenue(@CurrentUserId() userId: number): Observable<RevenueDataDto[]> {
    return this.statisticsService.getRevenue(userId);
  }

  @Get('top-rooms')
  @ApiOperation({
    summary: 'Get Top Performing Rooms',
    description:
      'Retrieve the top performing rooms based on bookings and revenue.',
  })
  @ApiResponse({
    status: 200,
    description: 'Top performing rooms retrieved successfully',
    type: [TopPerformingRoomDto],
  })
  getTopRooms(): Observable<TopPerformingRoomDto[]> {
    return this.statisticsService.getTopRooms();
  }

  @Get('activity')
  @ApiOperation({
    summary: 'Get Recent Activities',
    description:
      'Retrieve recent hotel activities including check-ins, check-outs, and maintenance events.',
  })
  @ApiResponse({
    status: 200,
    description: 'Recent activities retrieved successfully',
    type: [RecentActivityDto],
  })
  getRecentActivities(
    @CurrentUserId() userId: number,
  ): Observable<RecentActivityDto[]> {
    return this.statisticsService.getRecentActivities(userId);
  }
}
