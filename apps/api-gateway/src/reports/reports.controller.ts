import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { AuditLog } from '../audit/decorators/audit-log.decorator';
import { AuditResource } from '../audit/enums/audit-resource.enum';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';
import { ReportType } from './enums/report-type.enum';
import { ReportStatus } from './enums/report-status.enum';

@ApiTags('reports')
@Controller('reports')
@AuditLog({ resource: AuditResource.REPORT })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Reports',
    description: 'Retrieve a list of all reports.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  findAll(): Promise<Report[]> {
    return this.reportsService.findAll();
  }

  @Get('by-type')
  @ApiOperation({
    summary: 'Get Reports by Type',
    description: 'Retrieve reports filtered by type.',
  })
  @ApiQuery({
    name: 'type',
    enum: ReportType,
    description: 'Report type to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  getReportsByType(@Query('type') type: ReportType): Promise<Report[]> {
    return this.reportsService.findByType(type);
  }

  @Get('by-status')
  @ApiOperation({
    summary: 'Get Reports by Status',
    description: 'Retrieve reports filtered by status.',
  })
  @ApiQuery({
    name: 'status',
    enum: ReportStatus,
    description: 'Report status to filter by',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  getReportsByStatus(@Query('status') status: ReportStatus): Promise<Report[]> {
    return this.reportsService.findByStatus(status);
  }

  @Get('by-date-range')
  @ApiOperation({
    summary: 'Get Reports by Date Range',
    description: 'Retrieve reports within a specific date range.',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [Report],
  })
  getReportsByDateRange(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ): Promise<Report[]> {
    return this.reportsService.findByDateRange(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get Report by ID',
    description: 'Retrieve a specific report by its ID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Report retrieved successfully',
    type: Report,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Report | null> {
    return this.reportsService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create Report',
    description: 'Create a new report.',
  })
  @ApiBody({
    description: 'Report data',
    type: CreateReportDto,
  })
  @ApiResponse({
    status: 201,
    description: 'Report created successfully',
    type: Report,
  })
  create(@Body() createReportDto: CreateReportDto): Promise<Report> {
    return this.reportsService.create(createReportDto);
  }

  @Post('generate/occupancy')
  @ApiOperation({
    summary: 'Generate Occupancy Report',
    description: 'Generate a new occupancy report for a specific date range.',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiQuery({
    name: 'generatedBy',
    description: 'Username or ID of the person generating the report',
    example: 'admin@hotel.com',
  })
  @ApiResponse({
    status: 201,
    description: 'Occupancy report generated successfully',
    type: Report,
  })
  generateOccupancyReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('generatedBy') generatedBy: string,
  ): Promise<Report> {
    return this.reportsService.generateOccupancyReport(
      new Date(startDate),
      new Date(endDate),
      generatedBy,
    );
  }

  @Post('generate/revenue')
  @ApiOperation({
    summary: 'Generate Revenue Report',
    description: 'Generate a new revenue report for a specific date range.',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiQuery({
    name: 'generatedBy',
    description: 'Username or ID of the person generating the report',
    example: 'admin@hotel.com',
  })
  @ApiResponse({
    status: 201,
    description: 'Revenue report generated successfully',
    type: Report,
  })
  generateRevenueReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('generatedBy') generatedBy: string,
  ): Promise<Report> {
    return this.reportsService.generateRevenueReport(
      new Date(startDate),
      new Date(endDate),
      generatedBy,
    );
  }

  @Post('generate/guest-satisfaction')
  @ApiOperation({
    summary: 'Generate Guest Satisfaction Report',
    description:
      'Generate a new guest satisfaction report for a specific date range.',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiQuery({
    name: 'generatedBy',
    description: 'Username or ID of the person generating the report',
    example: 'admin@hotel.com',
  })
  @ApiResponse({
    status: 201,
    description: 'Guest satisfaction report generated successfully',
    type: Report,
  })
  generateGuestSatisfactionReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('generatedBy') generatedBy: string,
  ): Promise<Report> {
    return this.reportsService.generateGuestReport(
      new Date(startDate),
      new Date(endDate),
      generatedBy,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update Report',
    description: 'Update an existing report.',
  })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
    example: 1,
    type: Number,
  })
  @ApiBody({
    description: 'Updated report data',
    type: UpdateReportDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Report updated successfully',
    type: Report,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
  ): Promise<Report> {
    return this.reportsService.update(id, updateReportDto);
  }

  @Put(':id/status')
  @ApiOperation({
    summary: 'Update Report Status',
    description: 'Update the status of a specific report.',
  })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
    example: 1,
    type: Number,
  })
  @ApiQuery({
    name: 'status',
    enum: ReportStatus,
    description: 'New status for the report',
  })
  @ApiResponse({
    status: 200,
    description: 'Report status updated successfully',
    type: Report,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: ReportStatus,
  ): Promise<Report> {
    return this.reportsService.updateStatus(id, status);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete Report',
    description: 'Remove a report from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'Report ID',
    example: 1,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Report deleted successfully',
    type: Report,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<Report> {
    return this.reportsService.remove(id);
  }

  @Get('analytics/financial-summary')
  @ApiOperation({
    summary: 'Get Financial Summary',
    description:
      'Get financial summary including revenue, expenses, and profit for a date range.',
  })
  @ApiQuery({
    name: 'startDate',
    description: 'Start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @ApiQuery({
    name: 'endDate',
    description: 'End date (YYYY-MM-DD)',
    example: '2024-01-31',
  })
  @ApiResponse({
    status: 200,
    description: 'Financial summary retrieved successfully',
  })
  getFinancialSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportsService.getFinancialSummary(
      new Date(startDate),
      new Date(endDate),
    );
  }

  @Get('analytics/occupancy')
  @ApiOperation({
    summary: 'Get Occupancy by Month/Year',
    description: 'Get occupancy data for a specific month or entire year.',
  })
  @ApiQuery({
    name: 'year',
    description: 'Year',
    example: 2024,
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    description: 'Month (1-12, optional)',
    example: 1,
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'Occupancy data retrieved successfully',
  })
  getOccupancyByMonthYear(
    @Query('year') year: string,
    @Query('month') month?: string,
  ) {
    return this.reportsService.getOccupancyByMonthYear(
      parseInt(year),
      month ? parseInt(month) : undefined,
    );
  }

  @Get('analytics/monthly-revenue')
  @ApiOperation({
    summary: 'Get Monthly Revenue Comparison',
    description:
      'Get monthly revenue, expenses, and profit comparison for a year.',
  })
  @ApiQuery({
    name: 'year',
    description: 'Year',
    example: 2024,
    type: Number,
  })
  @ApiResponse({
    status: 200,
    description: 'Monthly revenue data retrieved successfully',
  })
  getMonthlyRevenueComparison(@Query('year') year: string) {
    return this.reportsService.getMonthlyRevenueComparison(parseInt(year));
  }

  @Get('download/financial-report')
  @ApiOperation({
    summary: 'Download Financial Report PDF',
    description:
      'Generate and download a comprehensive financial report including revenue, expenses, profits, and occupancy data.',
  })
  @ApiQuery({
    name: 'year',
    description: 'Year for the report',
    example: 2025,
    type: Number,
  })
  @ApiQuery({
    name: 'month',
    description: 'Month (1-12, optional)',
    example: 1,
    type: Number,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'PDF report generated successfully',
  })
  async downloadFinancialReport(
    @Query('year') year: string,
    @Query('month') month: string | undefined,
  ): Promise<StreamableFile> {
    return this.reportsService.generateFinancialReportPDF(
      parseInt(year),
      month ? parseInt(month) : undefined,
    );
  }
}
