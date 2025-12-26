import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Report } from './entities';
import {
  CreateReportDto,
  UpdateReportDto,
  ReportType,
  ReportStatus,
  ReportDto,
  FinancialSummaryDto,
  OccupancyDataDto,
  MonthlyRevenueDto,
} from '@app/contracts/reports-service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async create(data: CreateReportDto): Promise<ReportDto> {
    const report = this.reportRepository.create({
      ...data,
      status: data.status || ReportStatus.PENDING,
    });
    return this.reportRepository.save(report) as Promise<ReportDto>;
  }

  async findAll(): Promise<ReportDto[]> {
    return this.reportRepository.find({
      order: { createdAt: 'DESC' },
    }) as Promise<ReportDto[]>;
  }

  async findOne(id: number): Promise<ReportDto> {
    const report = await this.reportRepository.findOne({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return report as ReportDto;
  }

  async findByType(type: ReportType): Promise<ReportDto[]> {
    return this.reportRepository.find({
      where: { type },
      order: { createdAt: 'DESC' },
    }) as Promise<ReportDto[]>;
  }

  async findByStatus(status: ReportStatus): Promise<ReportDto[]> {
    return this.reportRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    }) as Promise<ReportDto[]>;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ReportDto[]> {
    return this.reportRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'DESC' },
    }) as Promise<ReportDto[]>;
  }

  async updateStatus(id: number, status: ReportStatus): Promise<ReportDto> {
    await this.reportRepository.update(id, { status });
    return this.findOne(id);
  }

  async update(id: number, data: UpdateReportDto): Promise<ReportDto> {
    await this.reportRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<ReportDto> {
    const report = await this.findOne(id);
    await this.reportRepository.remove(report as Report);
    return report;
  }

  async generateOccupancyReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<ReportDto> {
    return this.create({
      title: `Occupancy Report ${startDate.toDateString()} - ${endDate.toDateString()}`,
      type: ReportType.OCCUPANCY,
      startDate,
      endDate,
      parameters: {
        reportType: 'occupancy',
        dateRange: { startDate, endDate },
      },
      generatedBy,
    });
  }

  async generateRevenueReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<ReportDto> {
    return this.create({
      title: `Revenue Report ${startDate.toDateString()} - ${endDate.toDateString()}`,
      type: ReportType.REVENUE,
      startDate,
      endDate,
      parameters: {
        reportType: 'revenue',
        dateRange: { startDate, endDate },
      },
      generatedBy,
    });
  }

  async generateGuestSatisfactionReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<ReportDto> {
    return this.create({
      title: `Guest Satisfaction Report ${startDate.toDateString()} - ${endDate.toDateString()}`,
      type: ReportType.GUEST_SATISFACTION,
      startDate,
      endDate,
      parameters: {
        reportType: 'guest_satisfaction',
        dateRange: { startDate, endDate },
      },
      generatedBy,
    });
  }

  async getFinancialSummary(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _startDate: Date,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _endDate: Date,
  ): Promise<FinancialSummaryDto> {
    // This would typically gather data from billing-service
    // For now, return mock data structure
    return Promise.resolve({
      revenue: {
        room: 0,
        restaurant: 0,
        services: 0,
        events: 0,
        total: 0,
      },
      expenses: 0,
      grossProfit: 0,
      profitMargin: 0,
    });
  }

  getOccupancyByMonthYear(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _year: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _month?: number,
  ): Promise<OccupancyDataDto[]> {
    // This would typically gather data from booking-service
    // For now, return empty array
    return Promise.resolve([]);
  }

  getMonthlyRevenueComparison(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _year: number,
  ): Promise<MonthlyRevenueDto[]> {
    // This would typically gather data from billing-service
    // For now, return empty array
    return Promise.resolve([]);
  }

  async generateFinancialReportPdfData(
    year: number,
    month?: number,
  ): Promise<{
    financialSummary: FinancialSummaryDto;
    occupancyData: OccupancyDataDto[];
    monthlyRevenue: MonthlyRevenueDto[];
    year: number;
    month?: number;
  }> {
    const startDate = month
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    const endDate = month
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(year, 11, 31, 23, 59, 59);

    const financialSummary = await this.getFinancialSummary(startDate, endDate);
    const occupancyData = await this.getOccupancyByMonthYear(year, month);
    const monthlyRevenue = await this.getMonthlyRevenueComparison(year);

    return {
      financialSummary,
      occupancyData,
      monthlyRevenue,
      year,
      month,
    };
  }
}
