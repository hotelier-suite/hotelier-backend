import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { REPORTS_SERVICE_CLIENT } from '../constants';
import { ANALYTICS_PATTERNS } from '@app/contracts/reports-service/analytics.patterns';
import { AnalyticsMetric } from '@app/contracts/reports-service/analytics/enums/analytics-metric.enum';
import {
  AnalyticsDataDto,
  CreateAnalyticsDataDto,
  UpdateAnalyticsDataDto,
  DashboardSummaryResponseDto,
} from '@app/contracts/reports-service/analytics/dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(REPORTS_SERVICE_CLIENT)
    private readonly reportsClient: ClientProxy,
  ) {}

  create(data: CreateAnalyticsDataDto): Observable<AnalyticsDataDto> {
    return this.reportsClient.send<AnalyticsDataDto, CreateAnalyticsDataDto>(
      ANALYTICS_PATTERNS.CREATE,
      data,
    );
  }

  findAll(): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<AnalyticsDataDto[], Record<string, never>>(
      ANALYTICS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<AnalyticsDataDto> {
    return this.reportsClient.send<AnalyticsDataDto, number>(
      ANALYTICS_PATTERNS.FIND_ONE,
      id,
    );
  }

  update(
    id: number,
    data: UpdateAnalyticsDataDto,
  ): Observable<AnalyticsDataDto> {
    return this.reportsClient.send<
      AnalyticsDataDto,
      { id: number; data: UpdateAnalyticsDataDto }
    >(ANALYTICS_PATTERNS.UPDATE, { id, data });
  }

  delete(id: number): Observable<AnalyticsDataDto> {
    return this.reportsClient.send<AnalyticsDataDto, number>(
      ANALYTICS_PATTERNS.DELETE,
      id,
    );
  }

  getDashboardSummary(): Observable<DashboardSummaryResponseDto> {
    return this.reportsClient.send<
      DashboardSummaryResponseDto,
      Record<string, never>
    >(ANALYTICS_PATTERNS.GET_DASHBOARD_SUMMARY, {});
  }

  getOccupancyData(
    startDate?: string,
    endDate?: string,
  ): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<
      AnalyticsDataDto[],
      { startDate?: string; endDate?: string }
    >(ANALYTICS_PATTERNS.GET_OCCUPANCY_DATA, { startDate, endDate });
  }

  getRevenueData(
    startDate?: string,
    endDate?: string,
  ): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<
      AnalyticsDataDto[],
      { startDate?: string; endDate?: string }
    >(ANALYTICS_PATTERNS.GET_REVENUE_DATA, { startDate, endDate });
  }

  getGuestTypeData(): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<AnalyticsDataDto[], Record<string, never>>(
      ANALYTICS_PATTERNS.GET_GUEST_TYPE_DATA,
      {},
    );
  }

  getSatisfactionData(
    startDate?: string,
    endDate?: string,
  ): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<
      AnalyticsDataDto[],
      { startDate?: string; endDate?: string }
    >(ANALYTICS_PATTERNS.GET_SATISFACTION_DATA, { startDate, endDate });
  }

  getMetricTotals(
    metric: AnalyticsMetric,
    startDate: string,
    endDate: string,
  ): Observable<number> {
    return this.reportsClient.send<
      number,
      { metric: AnalyticsMetric; startDate: string; endDate: string }
    >(ANALYTICS_PATTERNS.GET_METRIC_TOTALS, { metric, startDate, endDate });
  }

  getMetricAverages(
    metric: AnalyticsMetric,
    startDate: string,
    endDate: string,
  ): Observable<number> {
    return this.reportsClient.send<
      number,
      { metric: AnalyticsMetric; startDate: string; endDate: string }
    >(ANALYTICS_PATTERNS.GET_METRIC_AVERAGES, { metric, startDate, endDate });
  }

  getMetricTrend(
    metric: AnalyticsMetric,
    days: number,
  ): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<
      AnalyticsDataDto[],
      { metric: AnalyticsMetric; days: number }
    >(ANALYTICS_PATTERNS.GET_METRIC_TREND, { metric, days });
  }

  recordMetric(
    metric: AnalyticsMetric,
    value: number,
    date?: string,
  ): Observable<AnalyticsDataDto> {
    return this.reportsClient.send<
      AnalyticsDataDto,
      { metric: AnalyticsMetric; value: number; date?: string }
    >(ANALYTICS_PATTERNS.RECORD_METRIC, { metric, value, date });
  }
}
