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
import { ReportsService } from './reports.service';
import { AuditLog } from '../../audit-service';
import { AuditResource } from '@app/contracts/audit-service';
import {
  ReportDto,
  CreateReportDto,
  UpdateReportDto,
  FinancialSummaryDto,
  OccupancyDataDto,
  MonthlyRevenueDto,
  ReportType,
  ReportStatus,
} from '@app/contracts/reports-service';
import * as PDFDocument from 'pdfkit';

@ApiTags('reports')
@Controller('reports')
@ApiBearerAuth()
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
    type: [ReportDto],
  })
  findAll(): Observable<ReportDto[]> {
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
    type: [ReportDto],
  })
  getReportsByType(@Query('type') type: ReportType): Observable<ReportDto[]> {
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
    type: [ReportDto],
  })
  getReportsByStatus(
    @Query('status') status: ReportStatus,
  ): Observable<ReportDto[]> {
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
    type: [ReportDto],
  })
  getReportsByDateRange(
    @Query('startDate', ParseDatePipe) startDate: Date,
    @Query('endDate', ParseDatePipe) endDate: Date,
  ): Observable<ReportDto[]> {
    return this.reportsService.findByDateRange(startDate, endDate);
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
    type: [OccupancyDataDto],
  })
  getOccupancyByMonthYear(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
  ): Observable<OccupancyDataDto[]> {
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
  async downloadFinancialReport(
    @Query('year', ParseIntPipe) year: number,
    @Query('month', new ParseIntPipe({ optional: true })) month?: number,
  ): Promise<StreamableFile> {
    return new Promise((resolve, reject) => {
      this.reportsService
        .generateFinancialReportPdfData(year, month)
        .subscribe({
          next: (data) => {
            const doc = new PDFDocument({ margin: 50 });
            const chunks: Buffer[] = [];

            doc.on('data', (chunk: Buffer) => chunks.push(chunk));

            doc.on('end', () => {
              const result = Buffer.concat(chunks);
              const file = new StreamableFile(result, {
                type: 'application/pdf',
                disposition: `attachment; filename="financial-report-${data.year}${data.month ? `-${data.month}` : ''}.pdf"`,
              });
              resolve(file);
            });

            doc.on('error', reject);

            // Header
            doc
              .fontSize(24)
              .font('Helvetica-Bold')
              .text('Hotelier Suite', { align: 'center' });
            doc
              .fontSize(18)
              .text('Financial and Occupancy Report', { align: 'center' });
            doc.moveDown();
            doc
              .fontSize(12)
              .font('Helvetica')
              .text(
                `Period: ${data.month ? `${this.getMonthName(data.month)} ${data.year}` : `Year ${data.year}`}`,
                { align: 'center' },
              );
            doc.text(
              `Generation date: ${new Date().toLocaleDateString('en')}`,
              { align: 'center' },
            );
            doc.moveDown(2);

            // Financial Summary Section
            doc.fontSize(16).font('Helvetica-Bold').text('Financial Summary');
            doc.moveDown();

            const summaryData = [
              ['Concept', 'Amount'],
              [
                'Total Revenue',
                `${data.financialSummary.revenue.total.toLocaleString()}`,
              ],
              [
                '  - Rooms',
                `${data.financialSummary.revenue.room.toLocaleString()}`,
              ],
              [
                '  - Restaurant',
                `${data.financialSummary.revenue.restaurant.toLocaleString()}`,
              ],
              [
                '  - Additional Services',
                `${data.financialSummary.revenue.services.toLocaleString()}`,
              ],
              [
                '  - Events',
                `${data.financialSummary.revenue.events.toLocaleString()}`,
              ],
              [
                'Expenses',
                `-${data.financialSummary.expenses.toLocaleString()}`,
              ],
              [
                'Gross Profit',
                `${data.financialSummary.grossProfit.toLocaleString()}`,
              ],
              [
                'Profit Margin',
                `${data.financialSummary.profitMargin.toFixed(1)}%`,
              ],
            ];

            this.drawTable(doc, summaryData);
            doc.moveDown(2);

            // Occupancy Section
            if (data.occupancyData.length > 0) {
              doc.fontSize(16).font('Helvetica-Bold').text('Occupancy Data');
              doc.moveDown();

              const avgOccupancy =
                data.occupancyData.reduce(
                  (sum, item) => sum + item.occupancyPercentage,
                  0,
                ) / data.occupancyData.length;
              const totalOccupancyRevenue = data.occupancyData.reduce(
                (sum, item) => sum + item.totalRevenue,
                0,
              );

              doc
                .fontSize(12)
                .font('Helvetica')
                .text(`Average Occupancy: ${avgOccupancy.toFixed(1)}%`)
                .text(
                  `Occupancy Revenue: ${totalOccupancyRevenue.toLocaleString()}`,
                )
                .text(`Days with Data: ${data.occupancyData.length}`);
              doc.moveDown();
            }

            // Monthly Revenue Comparison Section
            if (!data.month && data.monthlyRevenue.length > 0) {
              doc.addPage();
              doc
                .fontSize(16)
                .font('Helvetica-Bold')
                .text('Monthly Revenue Comparison');
              doc.moveDown();

              const monthlyTableData = [
                ['Month', 'Revenue', 'Expenses', 'Profit'],
                ...data.monthlyRevenue.map((item) => [
                  item.month,
                  `${item.revenue.toLocaleString()}`,
                  `${item.expenses.toLocaleString()}`,
                  `${item.profit.toLocaleString()}`,
                ]),
              ];

              this.drawTable(doc, monthlyTableData);
            }

            doc.end();
          },
          error: reject,
        });
    });
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
    type: ReportDto,
  })
  @ApiResponse({
    status: 404,
    description: 'Report not found',
  })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Query('status') status: ReportStatus,
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
    return this.reportsService.delete(id);
  }

  private drawTable(doc: PDFKit.PDFDocument, data: string[][]) {
    const startX = 50;
    let startY = doc.y;
    const columnWidth = 250;
    const rowHeight = 20;

    doc.font('Helvetica-Bold').fontSize(11);
    data[0].forEach((header, index) => {
      doc.text(header, startX + index * columnWidth, startY, {
        width: columnWidth,
      });
    });

    startY += rowHeight;
    doc
      .moveTo(startX, startY)
      .lineTo(startX + columnWidth * data[0].length, startY)
      .stroke();
    startY += 5;

    doc.font('Helvetica').fontSize(10);
    for (let i = 1; i < data.length; i++) {
      data[i].forEach((cell, index) => {
        doc.text(cell, startX + index * columnWidth, startY, {
          width: columnWidth,
        });
      });
      startY += rowHeight;
    }

    doc.y = startY;
  }

  private getMonthName(month: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }
}
