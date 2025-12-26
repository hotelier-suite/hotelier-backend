import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AnalyticsService } from './analytics.service';
import {
  ANALYTICS_PATTERNS,
  AnalyticsMetric,
  AnalyticsDataDto,
  CreateAnalyticsDataDto,
  UpdateAnalyticsDataDto,
  DashboardSummaryResponseDto,
} from '@app/contracts/reports-service';

@Controller()
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @MessagePattern(ANALYTICS_PATTERNS.CREATE)
  create(@Payload() data: CreateAnalyticsDataDto): Promise<AnalyticsDataDto> {
    return this.analyticsService.create(data);
  }

  @MessagePattern(ANALYTICS_PATTERNS.FIND_ALL)
  findAll(): Promise<AnalyticsDataDto[]> {
    return this.analyticsService.findAll();
  }

  @MessagePattern(ANALYTICS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<AnalyticsDataDto> {
    return this.analyticsService.findOne(id);
  }

  @MessagePattern(ANALYTICS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateAnalyticsDataDto },
  ): Promise<AnalyticsDataDto> {
    return this.analyticsService.update(payload.id, payload.data);
  }

  @MessagePattern(ANALYTICS_PATTERNS.DELETE)
  delete(@Payload() id: number): Promise<AnalyticsDataDto> {
    return this.analyticsService.remove(id);
  }

  @MessagePattern(ANALYTICS_PATTERNS.GET_DASHBOARD_SUMMARY)
  getDashboardSummary(): Promise<DashboardSummaryResponseDto> {
    return this.analyticsService.getDashboardSummary();
  }

  @MessagePattern(ANALYTICS_PATTERNS.GET_OCCUPANCY_DATA)
  getOccupancyData(
    @Payload() payload: { startDate?: Date; endDate?: Date },
  ): Promise<AnalyticsDataDto[]> {
    return this.analyticsService.getOccupancyData(
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(ANALYTICS_PATTERNS.GET_REVENUE_DATA)
  getRevenueData(
    @Payload() payload: { startDate?: Date; endDate?: Date },
  ): Promise<AnalyticsDataDto[]> {
    return this.analyticsService.getRevenueData(
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(ANALYTICS_PATTERNS.GET_GUEST_TYPE_DATA)
  getGuestTypeData(): Promise<AnalyticsDataDto[]> {
    return this.analyticsService.getGuestTypeData();
  }

  @MessagePattern(ANALYTICS_PATTERNS.GET_SATISFACTION_DATA)
  getSatisfactionData(
    @Payload() payload: { startDate?: Date; endDate?: Date },
  ): Promise<AnalyticsDataDto[]> {
    return this.analyticsService.getSatisfactionData(
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(ANALYTICS_PATTERNS.GET_METRIC_TOTALS)
  getMetricTotals(
    @Payload()
    payload: {
      metric: AnalyticsMetric;
      startDate: Date;
      endDate: Date;
    },
  ): Promise<number> {
    return this.analyticsService.getTotalMetric(
      payload.metric,
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(ANALYTICS_PATTERNS.GET_METRIC_AVERAGES)
  getMetricAverages(
    @Payload()
    payload: {
      metric: AnalyticsMetric;
      startDate: Date;
      endDate: Date;
    },
  ): Promise<number> {
    return this.analyticsService.getAverageMetric(
      payload.metric,
      payload.startDate,
      payload.endDate,
    );
  }

  @MessagePattern(ANALYTICS_PATTERNS.GET_METRIC_TREND)
  getMetricTrend(
    @Payload() payload: { metric: AnalyticsMetric; days: number },
  ): Promise<AnalyticsDataDto[]> {
    return this.analyticsService.getMetricTrend(payload.metric, payload.days);
  }

  @MessagePattern(ANALYTICS_PATTERNS.RECORD_METRIC)
  recordMetric(
    @Payload()
    payload: {
      metric: AnalyticsMetric;
      value: number;
      date?: Date;
    },
  ): Promise<AnalyticsDataDto> {
    return this.analyticsService.recordMetric(
      payload.metric,
      payload.value,
      payload.date,
    );
  }
}
