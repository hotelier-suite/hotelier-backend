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
import { ReportsAnalyticsService } from './reports-analytics.service';
import { AuditLog } from '../audit-service/audit/decorators/audit-log.decorator';
import { AuditResource } from '@app/contracts/audit-service/enums';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { CreateAnalyticsDataDto } from './dto/create-analytics-data.dto';
import { UpdateAnalyticsDataDto } from './dto/update-analytics-data.dto';
import { DashboardSummaryResponseDto } from './dto/dashboard-summary-response.dto';
import { AnalyticsData } from './entities/analytics-data.entity';

@ApiTags('reports-analytics')
@Controller('reports-analytics')
@AuditLog({ resource: AuditResource.ANALYTICS })
export class ReportsAnalyticsController {
  constructor(
    private readonly reportsAnalyticsService: ReportsAnalyticsService,
  ) {}

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
    type: AnalyticsData,
  })
  async create(
    @Body() createData: CreateAnalyticsDataDto,
  ): Promise<AnalyticsData> {
    return this.reportsAnalyticsService.create(createData);
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
    type: AnalyticsData,
  })
  @ApiResponse({
    status: 404,
    description: 'Analytics data not found',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<AnalyticsData> {
    return this.reportsAnalyticsService.findOne(id);
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
    type: AnalyticsData,
  })
  @ApiResponse({
    status: 404,
    description: 'Analytics data not found',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateAnalyticsDataDto,
  ): Promise<AnalyticsData> {
    return this.reportsAnalyticsService.update(id, updateData);
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
    type: AnalyticsData,
  })
  @ApiResponse({
    status: 404,
    description: 'Analytics data not found',
  })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<AnalyticsData> {
    return this.reportsAnalyticsService.remove(id);
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
  async getDashboardSummary(): Promise<DashboardSummaryResponseDto> {
    return this.reportsAnalyticsService.getDashboardSummary();
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
    type: [AnalyticsData],
  })
  async getOccupancyData(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<AnalyticsData[]> {
    return this.reportsAnalyticsService.getOccupancyData(startDate, endDate);
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
    type: [AnalyticsData],
  })
  async getRevenueData(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<AnalyticsData[]> {
    return this.reportsAnalyticsService.getRevenueData(startDate, endDate);
  }

  @Get('guest-types')
  @ApiOperation({
    summary: 'Get Guest Type Analytics',
    description: 'Retrieve guest type distribution analytics data.',
  })
  @ApiResponse({
    status: 200,
    description: 'Guest type analytics data retrieved successfully',
    type: [AnalyticsData],
  })
  async getGuestTypeData(): Promise<AnalyticsData[]> {
    return this.reportsAnalyticsService.getGuestTypeData();
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
    type: [AnalyticsData],
  })
  async getSatisfactionData(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<AnalyticsData[]> {
    return this.reportsAnalyticsService.getSatisfactionData(startDate, endDate);
  }
}
