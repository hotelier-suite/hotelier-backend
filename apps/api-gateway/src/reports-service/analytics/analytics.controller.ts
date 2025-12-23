import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Patch,
  Delete,
} from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AuditLog } from '../../audit/decorators/audit-log.decorator';
import { AuditResource } from '../../audit/enums/audit-resource.enum';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import {
  CreateAnalyticsDataDto,
  UpdateAnalyticsDataDto,
  DashboardSummaryResponseDto,
  AnalyticsDataDto,
} from '@app/contracts/reports-service/analytics/dto';

@ApiTags('reports-analytics')
@Controller('reports-analytics')
@ApiBearerAuth()
@AuditLog({ resource: AuditResource.ANALYTICS })
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create Analytics Data',
    description: 'Record new analytics data point.',
  })
  @ApiBody({
    description: 'Analytics data to create',
    type: CreateAnalyticsDataDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Analytics data created successfully',
    type: AnalyticsDataDto,
  })
  create(
    @Body() createData: CreateAnalyticsDataDto,
  ): Observable<AnalyticsDataDto> {
    return this.analyticsService.create(createData);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Analytics Data by ID',
    description: 'Retrieve a specific analytics data record by its ID.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Analytics data ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics data retrieved successfully',
    type: AnalyticsDataDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Analytics data not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<AnalyticsDataDto> {
    return this.analyticsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update Analytics Data',
    description: 'Update an existing analytics data record.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Analytics data ID',
    example: 1,
  })
  @ApiBody({
    description: 'Analytics data updates',
    type: UpdateAnalyticsDataDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics data updated successfully',
    type: AnalyticsDataDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Analytics data not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateAnalyticsDataDto,
  ): Observable<AnalyticsDataDto> {
    return this.analyticsService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Analytics Data',
    description: 'Delete an analytics data record.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'Analytics data ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Analytics data deleted successfully',
    type: AnalyticsDataDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Analytics data not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<AnalyticsDataDto> {
    return this.analyticsService.delete(id);
  }

  @Get('dashboard-summary')
  @ApiOperation({
    summary: 'Get Dashboard Summary',
    description: 'Get latest metrics summary for dashboard display.',
  })
  @ApiResponse({
    status: 200,
    description: 'Dashboard summary retrieved successfully',
    type: DashboardSummaryResponseDto,
  })
  getDashboardSummary(): Observable<DashboardSummaryResponseDto> {
    return this.analyticsService.getDashboardSummary();
  }

  @Get('occupancy')
  @ApiOperation({
    summary: 'Get Occupancy Analytics',
    description:
      'Retrieve occupancy rate analytics data for a specified date range.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for analytics data (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for analytics data (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Occupancy analytics data retrieved successfully',
    type: [AnalyticsDataDto],
  })
  getOccupancyData(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Observable<AnalyticsDataDto[]> {
    return this.analyticsService.getOccupancyData(startDate, endDate);
  }

  @Get('revenue')
  @ApiOperation({
    summary: 'Get Revenue Analytics',
    description:
      'Retrieve revenue per room analytics data for a specified date range.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for analytics data (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for analytics data (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Revenue analytics data retrieved successfully',
    type: [AnalyticsDataDto],
  })
  getRevenueData(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Observable<AnalyticsDataDto[]> {
    return this.analyticsService.getRevenueData(startDate, endDate);
  }

  @Get('guest-types')
  @ApiOperation({
    summary: 'Get Guest Type Analytics',
    description: 'Retrieve guest type distribution analytics data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest type analytics data retrieved successfully',
    type: [AnalyticsDataDto],
  })
  getGuestTypeData(): Observable<AnalyticsDataDto[]> {
    return this.analyticsService.getGuestTypeData();
  }

  @Get('satisfaction')
  @ApiOperation({
    summary: 'Get Customer Satisfaction Analytics',
    description:
      'Retrieve customer satisfaction analytics data for a specified date range.',
  })
  @ApiQuery({
    name: 'startDate',
    required: false,
    type: String,
    description: 'Start date for analytics data (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    type: String,
    description: 'End date for analytics data (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer satisfaction analytics data retrieved successfully',
    type: [AnalyticsDataDto],
  })
  getSatisfactionData(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Observable<AnalyticsDataDto[]> {
    return this.analyticsService.getSatisfactionData(startDate, endDate);
  }
}
