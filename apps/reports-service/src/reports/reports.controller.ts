import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReportsService } from './reports.service';
import {
  REPORTS_PATTERNS,
  ReportDto,
  CreateReportDto,
  UpdateReportDto,
  FinancialSummaryDto,
  OccupancyDataDto,
  MonthlyRevenueDto,
  ReportType,
  ReportStatus,
} from '@app/contracts/reports-service';

@Controller()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @MessagePattern(REPORTS_PATTERNS.FIND_ALL)
  findAll(): Promise<ReportDto[]> {
    return this.reportsService.findAll();
  }

  @MessagePattern(REPORTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<ReportDto> {
    return this.reportsService.findOne(id);
  }

  @MessagePattern(REPORTS_PATTERNS.CREATE)
  create(@Payload() data: CreateReportDto): Promise<ReportDto> {
    return this.reportsService.create(data);
  }

  @MessagePattern(REPORTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateReportDto },
  ): Promise<ReportDto> {
    return this.reportsService.update(payload.id, payload.data);
  }

  @MessagePattern(REPORTS_PATTERNS.DELETE)
  delete(@Payload() id: number): Promise<ReportDto> {
    return this.reportsService.remove(id);
  }

  @MessagePattern(REPORTS_PATTERNS.FIND_BY_TYPE)
  findByType(@Payload() type: ReportType): Promise<ReportDto[]> {
    return this.reportsService.findByType(type);
  }

  @MessagePattern(REPORTS_PATTERNS.FIND_BY_STATUS)
  findByStatus(@Payload() status: ReportStatus): Promise<ReportDto[]> {
    return this.reportsService.findByStatus(status);
  }

  @MessagePattern(REPORTS_PATTERNS.FIND_BY_DATE_RANGE)
  findByDateRange(
    @Payload() payload: { startDate: string; endDate: string },
  ): Promise<ReportDto[]> {
    return this.reportsService.findByDateRange(
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }

  @MessagePattern(REPORTS_PATTERNS.UPDATE_STATUS)
  updateStatus(
    @Payload() payload: { id: number; status: ReportStatus },
  ): Promise<ReportDto> {
    return this.reportsService.updateStatus(payload.id, payload.status);
  }

  @MessagePattern(REPORTS_PATTERNS.GENERATE_OCCUPANCY)
  generateOccupancyReport(
    @Payload()
    payload: {
      startDate: string;
      endDate: string;
      generatedBy: string;
    },
  ): Promise<ReportDto> {
    return this.reportsService.generateOccupancyReport(
      new Date(payload.startDate),
      new Date(payload.endDate),
      payload.generatedBy,
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GENERATE_REVENUE)
  generateRevenueReport(
    @Payload()
    payload: {
      startDate: string;
      endDate: string;
      generatedBy: string;
    },
  ): Promise<ReportDto> {
    return this.reportsService.generateRevenueReport(
      new Date(payload.startDate),
      new Date(payload.endDate),
      payload.generatedBy,
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GENERATE_GUEST_SATISFACTION)
  generateGuestSatisfactionReport(
    @Payload()
    payload: {
      startDate: string;
      endDate: string;
      generatedBy: string;
    },
  ): Promise<ReportDto> {
    return this.reportsService.generateGuestSatisfactionReport(
      new Date(payload.startDate),
      new Date(payload.endDate),
      payload.generatedBy,
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GET_FINANCIAL_SUMMARY)
  getFinancialSummary(
    @Payload() payload: { startDate: string; endDate: string },
  ): Promise<FinancialSummaryDto> {
    return this.reportsService.getFinancialSummary(
      new Date(payload.startDate),
      new Date(payload.endDate),
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GET_OCCUPANCY_BY_MONTH_YEAR)
  getOccupancyByMonthYear(
    @Payload() payload: { year: number; month?: number },
  ): Promise<OccupancyDataDto[]> {
    return this.reportsService.getOccupancyByMonthYear(
      payload.year,
      payload.month,
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GET_MONTHLY_REVENUE_COMPARISON)
  getMonthlyRevenueComparison(
    @Payload() payload: { year: number },
  ): Promise<MonthlyRevenueDto[]> {
    return this.reportsService.getMonthlyRevenueComparison(payload.year);
  }

  @MessagePattern(REPORTS_PATTERNS.GENERATE_FINANCIAL_REPORT_PDF)
  generateFinancialReportPdfData(
    @Payload() payload: { year: number; month?: number },
  ): Promise<{
    financialSummary: FinancialSummaryDto;
    occupancyData: OccupancyDataDto[];
    monthlyRevenue: MonthlyRevenueDto[];
    year: number;
    month?: number;
  }> {
    return this.reportsService.generateFinancialReportPdfData(
      payload.year,
      payload.month,
    );
  }
}
