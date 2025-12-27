import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AnalyticsData } from './entities';
import {
  AnalyticsMetric,
  CreateAnalyticsDataDto,
  UpdateAnalyticsDataDto,
  AnalyticsDataDto,
  DashboardSummaryResponseDto,
  MetricSummaryDto,
  DistinctMetricResultDto,
  AverageMetricResultDto,
  TotalMetricResultDto,
} from '@app/contracts/reports-service';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AnalyticsData)
    private readonly analyticsRepository: Repository<AnalyticsData>,
  ) {}

  async create(data: CreateAnalyticsDataDto): Promise<AnalyticsDataDto> {
    const analyticsData = this.analyticsRepository.create(data);
    return this.analyticsRepository.save(
      analyticsData,
    ) as Promise<AnalyticsDataDto>;
  }

  async findAll(): Promise<AnalyticsDataDto[]> {
    return this.analyticsRepository.find({
      order: { date: 'DESC' },
    }) as Promise<AnalyticsDataDto[]>;
  }

  async findOne(id: number): Promise<AnalyticsDataDto> {
    const analyticsData = await this.analyticsRepository.findOne({
      where: { id },
    });

    if (!analyticsData) {
      throw new RpcException({
        statusCode: 404,
        message: `Analytics data with ID ${id} not found`,
      });
    }

    return analyticsData as AnalyticsDataDto;
  }

  async update(
    id: number,
    data: UpdateAnalyticsDataDto,
  ): Promise<AnalyticsDataDto> {
    const existingData = await this.findOne(id);
    const updatedData = { ...existingData, ...data };
    return this.analyticsRepository.save(
      updatedData as AnalyticsData,
    ) as Promise<AnalyticsDataDto>;
  }

  async remove(id: number): Promise<AnalyticsDataDto> {
    const analyticsData = await this.findOne(id);
    await this.analyticsRepository.remove(analyticsData as AnalyticsData);
    return analyticsData;
  }

  async recordMetric(
    metric: AnalyticsMetric,
    value: number,
    date?: Date,
  ): Promise<AnalyticsDataDto> {
    return this.analyticsRepository.save({
      metric,
      value,
      date: date || new Date(),
    }) as Promise<AnalyticsDataDto>;
  }

  async findByType(
    metric: AnalyticsMetric,
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsDataDto[]> {
    return this.analyticsRepository.find({
      where: {
        metric,
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    }) as Promise<AnalyticsDataDto[]>;
  }

  async findByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsDataDto[]> {
    return this.analyticsRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC', metric: 'ASC' },
    }) as Promise<AnalyticsDataDto[]>;
  }

  async getLatestMetrics(): Promise<MetricSummaryDto[]> {
    const results = await this.analyticsRepository
      .createQueryBuilder('analytics')
      .select('analytics.metric', 'metric')
      .addSelect('analytics.value', 'value')
      .addSelect('analytics.date', 'date')
      .distinctOn(['analytics.metric'])
      .orderBy('analytics.metric')
      .addOrderBy('analytics.date', 'DESC')
      .getRawMany<DistinctMetricResultDto>();

    return results.map((result) => ({
      metric: result.metric as AnalyticsMetric,
      value: parseFloat(result.value) || 0,
      date: result.date,
    }));
  }

  async getMetricAverages(
    metric: AnalyticsMetric,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.analyticsRepository
      .createQueryBuilder('analytics')
      .select('AVG(analytics.value)', 'average')
      .where('analytics.metric = :metric', { metric })
      .andWhere('analytics.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<AverageMetricResultDto>();

    return parseFloat(result?.average || '0') || 0;
  }

  async getMetricTotals(
    metric: AnalyticsMetric,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.analyticsRepository
      .createQueryBuilder('analytics')
      .select('SUM(analytics.value)', 'total')
      .where('analytics.metric = :metric', { metric })
      .andWhere('analytics.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<TotalMetricResultDto>();

    return parseFloat(result?.total || '0') || 0;
  }

  async getMetricTrend(
    metric: AnalyticsMetric,
    days: number,
  ): Promise<AnalyticsDataDto[]> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    return this.findByType(metric, startDate, endDate);
  }

  async getDashboardSummary(): Promise<DashboardSummaryResponseDto> {
    const latestMetrics = await this.getLatestMetrics();
    const summary: DashboardSummaryResponseDto = {};

    latestMetrics.forEach((metric) => {
      switch (metric.metric) {
        case AnalyticsMetric.OCCUPANCY_RATE:
          summary.OCCUPANCY_RATE = metric.value;
          break;
        case AnalyticsMetric.REVENUE_PER_ROOM:
          summary.REVENUE_PER_ROOM = metric.value;
          break;
        case AnalyticsMetric.CUSTOMER_SATISFACTION:
          summary.CUSTOMER_SATISFACTION = metric.value;
          break;
        case AnalyticsMetric.AVERAGE_STAY_LENGTH:
          summary.AVERAGE_STAY_LENGTH = metric.value;
          break;
        case AnalyticsMetric.REPEAT_CUSTOMER_RATE:
          summary.REPEAT_CUSTOMER_RATE = metric.value;
          break;
        case AnalyticsMetric.STAFF_EFFICIENCY:
          summary.STAFF_EFFICIENCY = metric.value;
          break;
      }
    });

    return summary;
  }

  async getOccupancyData(
    startDate?: Date,
    endDate?: Date,
  ): Promise<AnalyticsDataDto[]> {
    const start = startDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ?? new Date();

    return this.findByType(AnalyticsMetric.OCCUPANCY_RATE, start, end);
  }

  async getRevenueData(
    startDate?: Date,
    endDate?: Date,
  ): Promise<AnalyticsDataDto[]> {
    const start = startDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ?? new Date();

    return this.findByType(AnalyticsMetric.REVENUE_PER_ROOM, start, end);
  }

  async getGuestTypeData(): Promise<AnalyticsDataDto[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();

    return this.findByDateRange(thirtyDaysAgo, now);
  }

  async getSatisfactionData(
    startDate?: Date,
    endDate?: Date,
  ): Promise<AnalyticsDataDto[]> {
    const start = startDate ?? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ?? new Date();

    return this.findByType(AnalyticsMetric.CUSTOMER_SATISFACTION, start, end);
  }
}
