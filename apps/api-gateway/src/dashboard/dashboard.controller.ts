import { Controller, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardStatsDto } from './dto/dashboard-stats.dto';
import { RecentActivityDto } from './dto/recent-activity.dto';
import { RevenueDataDto } from './dto/revenue-data.dto';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';
import { Observable } from 'rxjs';

@ApiTags('dashboard')
@Controller('dashboard')
@AuditLog({ resource: AuditResource.ANALYTICS })
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

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
  getDashboardStats(
    @CurrentUserId() userId: number,
  ): Observable<DashboardStatsDto> {
    return this.dashboardService.getDashboardStats(userId);
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
    return this.dashboardService.getRecentActivities(userId);
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
  getRevenueData(
    @CurrentUserId() userId: number,
  ): Observable<RevenueDataDto[]> {
    return this.dashboardService.getRevenueData(userId);
  }
}
