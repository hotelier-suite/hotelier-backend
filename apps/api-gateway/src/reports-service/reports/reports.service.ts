import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { REPORTS_SERVICE_CLIENT } from '../constants';
import { REPORTS_PATTERNS } from '@app/contracts/reports-service/reports.patterns';
import { ReportType } from '@app/contracts/reports-service/reports/enums/report-type.enum';
import { ReportStatus } from '@app/contracts/reports-service/reports/enums/report-status.enum';
import {
  ReportDto,
  CreateReportDto,
  UpdateReportDto,
  FinancialSummaryDto,
  OccupancyDataDto,
  MonthlyRevenueDto,
} from '@app/contracts/reports-service/reports/dto';

@Injectable()
export class ReportsService {
  constructor(
    @Inject(REPORTS_SERVICE_CLIENT)
    private readonly reportsClient: ClientProxy,
  ) {}

  findAll(): Observable<ReportDto[]> {
    return this.reportsClient.send<ReportDto[], Record<string, never>>(
      REPORTS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<ReportDto> {
    return this.reportsClient.send<ReportDto, number>(
      REPORTS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateReportDto): Observable<ReportDto> {
    return this.reportsClient.send<ReportDto, CreateReportDto>(
      REPORTS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateReportDto): Observable<ReportDto> {
    return this.reportsClient.send<
      ReportDto,
      { id: number; data: UpdateReportDto }
    >(REPORTS_PATTERNS.UPDATE, { id, data });
  }

  delete(id: number): Observable<ReportDto> {
    return this.reportsClient.send<ReportDto, number>(
      REPORTS_PATTERNS.DELETE,
      id,
    );
  }

  findByType(type: ReportType): Observable<ReportDto[]> {
    return this.reportsClient.send<ReportDto[], ReportType>(
      REPORTS_PATTERNS.FIND_BY_TYPE,
      type,
    );
  }

  findByStatus(status: ReportStatus): Observable<ReportDto[]> {
    return this.reportsClient.send<ReportDto[], ReportStatus>(
      REPORTS_PATTERNS.FIND_BY_STATUS,
      status,
    );
  }

  findByDateRange(startDate: string, endDate: string): Observable<ReportDto[]> {
    return this.reportsClient.send<
      ReportDto[],
      { startDate: string; endDate: string }
    >(REPORTS_PATTERNS.FIND_BY_DATE_RANGE, { startDate, endDate });
  }

  updateStatus(id: number, status: ReportStatus): Observable<ReportDto> {
    return this.reportsClient.send<
      ReportDto,
      { id: number; status: ReportStatus }
    >(REPORTS_PATTERNS.UPDATE_STATUS, { id, status });
  }

  generateOccupancyReport(
    startDate: string,
    endDate: string,
    generatedBy: string,
  ): Observable<ReportDto> {
    return this.reportsClient.send<
      ReportDto,
      { startDate: string; endDate: string; generatedBy: string }
    >(REPORTS_PATTERNS.GENERATE_OCCUPANCY, { startDate, endDate, generatedBy });
  }

  generateRevenueReport(
    startDate: string,
    endDate: string,
    generatedBy: string,
  ): Observable<ReportDto> {
    return this.reportsClient.send<
      ReportDto,
      { startDate: string; endDate: string; generatedBy: string }
    >(REPORTS_PATTERNS.GENERATE_REVENUE, { startDate, endDate, generatedBy });
  }

  generateGuestSatisfactionReport(
    startDate: string,
    endDate: string,
    generatedBy: string,
  ): Observable<ReportDto> {
    return this.reportsClient.send<
      ReportDto,
      { startDate: string; endDate: string; generatedBy: string }
    >(REPORTS_PATTERNS.GENERATE_GUEST_SATISFACTION, {
      startDate,
      endDate,
      generatedBy,
    });
  }

  getFinancialSummary(
    startDate: string,
    endDate: string,
  ): Observable<FinancialSummaryDto> {
    return this.reportsClient.send<
      FinancialSummaryDto,
      { startDate: string; endDate: string }
    >(REPORTS_PATTERNS.GET_FINANCIAL_SUMMARY, { startDate, endDate });
  }

  getOccupancyByMonthYear(
    year: number,
    month?: number,
  ): Observable<OccupancyDataDto[]> {
    return this.reportsClient.send<
      OccupancyDataDto[],
      { year: number; month?: number }
    >(REPORTS_PATTERNS.GET_OCCUPANCY_BY_MONTH_YEAR, { year, month });
  }

  getMonthlyRevenueComparison(year: number): Observable<MonthlyRevenueDto[]> {
    return this.reportsClient.send<MonthlyRevenueDto[], { year: number }>(
      REPORTS_PATTERNS.GET_MONTHLY_REVENUE_COMPARISON,
      { year },
    );
  }

  generateFinancialReportPdfData(
    year: number,
    month?: number,
  ): Observable<{
    financialSummary: FinancialSummaryDto;
    occupancyData: OccupancyDataDto[];
    monthlyRevenue: MonthlyRevenueDto[];
    year: number;
    month?: number;
  }> {
    return this.reportsClient.send<
      {
        financialSummary: FinancialSummaryDto;
        occupancyData: OccupancyDataDto[];
        monthlyRevenue: MonthlyRevenueDto[];
        year: number;
        month?: number;
      },
      { year: number; month?: number }
    >(REPORTS_PATTERNS.GENERATE_FINANCIAL_REPORT_PDF, { year, month });
  }
}
