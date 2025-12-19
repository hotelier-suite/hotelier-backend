import { AnalyticsMetric } from '../enums/analytics-metric.enum';

export interface MetricSummaryInterface {
  metric: AnalyticsMetric;
  value: number;
  date: Date;
}
