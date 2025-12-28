import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { REPORTS_SERVICE_CLIENT } from '../constants';
import {
  ANALYTICS_PATTERNS,
  AnalyticsDataDto,
  AnalyticsMetric,
  CreateAnalyticsDataDto,
  UpdateAnalyticsDataDto,
  DashboardSummaryResponseDto,
  FindAnalyticsFilterDto,
} from '@app/contracts/reports-service';

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

  findAll(filters: FindAnalyticsFilterDto): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<AnalyticsDataDto[], FindAnalyticsFilterDto>(
      ANALYTICS_PATTERNS.FIND_ALL,
      filters,
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

  remove(id: number): Observable<AnalyticsDataDto> {
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
    startDate?: Date,
    endDate?: Date,
  ): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<
      AnalyticsDataDto[],
      { startDate?: Date; endDate?: Date }
    >(ANALYTICS_PATTERNS.GET_OCCUPANCY_DATA, {
      startDate,
      endDate,
    });
  }

  getRevenueData(
    startDate?: Date,
    endDate?: Date,
  ): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<
      AnalyticsDataDto[],
      { startDate?: Date; endDate?: Date }
    >(ANALYTICS_PATTERNS.GET_REVENUE_DATA, {
      startDate,
      endDate,
    });
  }

  getGuestTypeData(): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<AnalyticsDataDto[], Record<string, never>>(
      ANALYTICS_PATTERNS.GET_GUEST_TYPE_DATA,
      {},
    );
  }

  getSatisfactionData(
    startDate?: Date,
    endDate?: Date,
  ): Observable<AnalyticsDataDto[]> {
    return this.reportsClient.send<
      AnalyticsDataDto[],
      { startDate?: Date; endDate?: Date }
    >(ANALYTICS_PATTERNS.GET_SATISFACTION_DATA, {
      startDate,
      endDate,
    });
  }

  getMetricTotals(
    metric: AnalyticsMetric,
    startDate: Date,
    endDate: Date,
  ): Observable<number> {
    return this.reportsClient.send<
      number,
      { metric: AnalyticsMetric; startDate: Date; endDate: Date }
    >(ANALYTICS_PATTERNS.GET_METRIC_TOTALS, { metric, startDate, endDate });
  }

  getMetricAverages(
    metric: AnalyticsMetric,
    startDate: Date,
    endDate: Date,
  ): Observable<number> {
    return this.reportsClient.send<
      number,
      { metric: AnalyticsMetric; startDate: Date; endDate: Date }
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
    date?: Date,
  ): Observable<AnalyticsDataDto> {
    return this.reportsClient.send<
      AnalyticsDataDto,
      { metric: AnalyticsMetric; value: number; date?: Date }
    >(ANALYTICS_PATTERNS.RECORD_METRIC, { metric, value, date });
  }
}
