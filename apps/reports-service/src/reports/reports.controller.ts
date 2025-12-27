import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ReportsService } from './reports.service';
import {
  REPORTS_PATTERNS,
  ReportDto,
  CreateReportDto,
  UpdateReportDto,
  FinancialSummaryDto,
  ReportOccupancyDataDto,
  MonthlyRevenueDto,
  ReportType,
  ReportStatus,
  FinancialReportPdfDto,
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
  remove(@Payload() id: number): Promise<ReportDto> {
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
    @Payload() payload: { startDate: Date; endDate: Date },
  ): Promise<ReportDto[]> {
    return this.reportsService.findByDateRange(
      payload.startDate,
      payload.endDate,
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
      startDate: Date;
      endDate: Date;
      generatedBy: string;
    },
  ): Promise<ReportDto> {
    return this.reportsService.generateOccupancyReport(
      payload.startDate,
      payload.endDate,
      payload.generatedBy,
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GENERATE_REVENUE)
  generateRevenueReport(
    @Payload()
    payload: {
      startDate: Date;
      endDate: Date;
      generatedBy: string;
    },
  ): Promise<ReportDto> {
    return this.reportsService.generateRevenueReport(
      payload.startDate,
      payload.endDate,
      payload.generatedBy,
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GENERATE_GUEST_SATISFACTION)
  generateGuestSatisfactionReport(
    @Payload()
    payload: {
      startDate: Date;
      endDate: Date;
      generatedBy: string;
    },
  ): Promise<ReportDto> {
    return this.reportsService.generateGuestSatisfactionReport(
      payload.startDate,
      payload.endDate,
      payload.generatedBy,
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GET_FINANCIAL_SUMMARY)
  getFinancialSummary(
    @Payload() payload: { startDate: Date; endDate: Date },
  ): Promise<FinancialSummaryDto> {
    return this.reportsService.getFinancialSummary(
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(REPORTS_PATTERNS.GET_OCCUPANCY_BY_MONTH_YEAR)
  getOccupancyByMonthYear(
    @Payload() payload: { year: number; month?: number },
  ): Promise<ReportOccupancyDataDto[]> {
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
  generateFinancialReportPdf(
    @Payload() payload: { year: number; month?: number },
  ): Promise<FinancialReportPdfDto> {
    return this.reportsService.generateFinancialReportPdf(
      payload.year,
      payload.month,
    );
  }
}
