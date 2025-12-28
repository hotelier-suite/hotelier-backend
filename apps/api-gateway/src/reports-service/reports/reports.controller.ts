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
  ParseDatePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportsService } from './reports.service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import {
  ReportDto,
  CreateReportDto,
  UpdateReportDto,
  FinancialSummaryDto,
  ReportOccupancyDataDto,
  MonthlyRevenueDto,
  FindReportsFilterDto,
  ReportStatus,
} from '@app/contracts/reports-service';

@ApiTags('reports')
@Controller('reports')
@ApiBearerAuth()
@AuditLog({ resource: AuditResource.REPORT })
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get All Reports',
    description:
      'Retrieve a list of all reports with optional filters for type, status, and date range.',
  })
  @ApiResponse({
    status: 200,
    description: 'Reports retrieved successfully',
    type: [ReportDto],
  })
  findAll(@Query() filters: FindReportsFilterDto): Observable<ReportDto[]> {
    return this.reportsService.findAll(filters);
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
    type: FinancialSummaryDto,
  })
  getFinancialSummary(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ): Observable<FinancialSummaryDto> {
    return this.reportsService.getFinancialSummary(startDate, endDate);
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
    type: [ReportOccupancyDataDto],
  })
  getOccupancyByMonthYear(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
  ): Observable<ReportOccupancyDataDto[]> {
    return this.reportsService.getOccupancyByMonthYear(year, month);
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
    type: [MonthlyRevenueDto],
  })
  getMonthlyRevenueComparison(
    @Query('year', ParseIntPipe) year: number,
  ): Observable<MonthlyRevenueDto[]> {
    return this.reportsService.getMonthlyRevenueComparison(year);
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
  downloadFinancialReport(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
  ): Observable<StreamableFile> {
    return this.reportsService.generateFinancialReportPdf(year, month).pipe(
      map(
        (result) =>
          new StreamableFile(Buffer.from(result.buffer), {
            type: 'application/pdf',
            disposition: `attachment; filename="${result.filename}"`,
          }),
      ),
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
    type: ReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  findOne(@Param('id', ParseIntPipe) id: number): Observable<ReportDto> {
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
    type: ReportDto,
  })
  create(@Body() createReportDto: CreateReportDto): Observable<ReportDto> {
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
    type: ReportDto,
  })
  generateOccupancyReport(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Query('generatedBy') generatedBy: string,
  ): Observable<ReportDto> {
    return this.reportsService.generateOccupancyReport(
      startDate,
      endDate,
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
    type: ReportDto,
  })
  generateRevenueReport(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Query('generatedBy') generatedBy: string,
  ): Observable<ReportDto> {
    return this.reportsService.generateRevenueReport(
      startDate,
      endDate,
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
    type: ReportDto,
  })
  generateGuestSatisfactionReport(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
    @Query('generatedBy') generatedBy: string,
  ): Observable<ReportDto> {
    return this.reportsService.generateGuestSatisfactionReport(
      startDate,
      endDate,
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
    type: ReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateReportDto: UpdateReportDto,
  ): Observable<ReportDto> {
    return this.reportsService.update(id, updateReportDto);
  }

  @Put(':id/status/:status')
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
  @ApiParam({
    name: 'status',
    enum: ReportStatus,
    description: 'New status for the report',
  })
  @ApiResponse({
    status: 200,
    description: 'Report status updated successfully',
    type: ReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: ReportStatus,
  ): Observable<ReportDto> {
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
    type: ReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  remove(@Param('id', ParseIntPipe) id: number): Observable<ReportDto> {
    return this.reportsService.remove(id);
  }
}
