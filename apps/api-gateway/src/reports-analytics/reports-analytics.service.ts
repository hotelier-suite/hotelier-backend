import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AnalyticsData } from './entities/analytics-data.entity';
import { AnalyticsMetric } from './enums/analytics-metric.enum';
import { CreateAnalyticsDataDto } from './dto/create-analytics-data.dto';
import { UpdateAnalyticsDataDto } from './dto/update-analytics-data.dto';
import { DistinctMetricResultDto } from './dto/distinct-metric-result.dto';
import { AverageMetricResultDto } from './dto/average-metric-result.dto';
import { TotalMetricResultDto } from './dto/total-metric-result.dto';
import { DashboardSummaryResponseDto } from './dto/dashboard-summary-response.dto';
import { MetricSummaryInterface } from './interfaces/metric-summary.interface';

@Injectable()
export class ReportsAnalyticsService {
  constructor(
    @InjectRepository(AnalyticsData)
    private readonly analyticsRepository: Repository<AnalyticsData>,
  ) {}

  async create(data: CreateAnalyticsDataDto): Promise<AnalyticsData> {
    return this.analyticsRepository.save(data);
  }

  async findOne(id: number): Promise<AnalyticsData> {
    const analyticsData = await this.analyticsRepository.findOne({
      where: { id },
    });

    if (!analyticsData) {
      throw new NotFoundException(`Analytics data with ID ${id} not found`);
    }

    return analyticsData;
  }

  async update(
    id: number,
    data: UpdateAnalyticsDataDto,
  ): Promise<AnalyticsData> {
    const existingData = await this.findOne(id);
    const updatedData = { ...existingData, ...data };
    return this.analyticsRepository.save(updatedData);
  }

  async remove(id: number): Promise<AnalyticsData> {
    const analyticsData = await this.findOne(id);
    await this.analyticsRepository.remove(analyticsData);
    return analyticsData;
  }

  async recordMetric(
    metric: AnalyticsMetric,
    value: number,
    date?: Date,
  ): Promise<AnalyticsData> {
    return this.analyticsRepository.save({
      metric,
      value,
      date: date || new Date(),
    });
  }

  async getMetricsByType(
    metric: AnalyticsMetric,
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsData[]> {
    return this.analyticsRepository.find({
      where: {
        metric,
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC' },
    });
  }

  async getMetricsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsData[]> {
    return this.analyticsRepository.find({
      where: {
        date: Between(startDate, endDate),
      },
      order: { date: 'ASC', metric: 'ASC' },
    });
  }

  async getLatestMetrics(): Promise<MetricSummaryInterface[]> {
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

  async getAverageMetric(
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

  async getTotalMetric(
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
  ): Promise<AnalyticsData[]> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    return this.getMetricsByType(metric, startDate, endDate);
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

  // Analytics endpoint methods
  async getOccupancyData(
    startDate?: string,
    endDate?: string,
  ): Promise<AnalyticsData[]> {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.getMetricsByType(AnalyticsMetric.OCCUPANCY_RATE, start, end);
  }

  async getRevenueData(
    startDate?: string,
    endDate?: string,
  ): Promise<AnalyticsData[]> {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.getMetricsByType(AnalyticsMetric.REVENUE_PER_ROOM, start, end);
  }

  async getGuestTypeData(): Promise<AnalyticsData[]> {
    // For guest type data, we'll get recent data across all metrics
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const now = new Date();

    return this.getMetricsByDateRange(thirtyDaysAgo, now);
  }

  async getSatisfactionData(
    startDate?: string,
    endDate?: string,
  ): Promise<AnalyticsData[]> {
    const start = startDate
      ? new Date(startDate)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    return this.getMetricsByType(
      AnalyticsMetric.CUSTOMER_SATISFACTION,
      start,
      end,
    );
  }
}
