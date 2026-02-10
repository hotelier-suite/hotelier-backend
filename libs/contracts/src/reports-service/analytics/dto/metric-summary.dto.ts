import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsDate } from 'class-validator';
import { AnalyticsMetric } from '../enums';

export class MetricSummaryDto {
  @ApiProperty({
    description: 'Type of analytics metric',
    enum: AnalyticsMetric,
    example: AnalyticsMetric.OCCUPANCY_RATE,
  })
  @IsEnum(AnalyticsMetric)
  metric: AnalyticsMetric;

  @ApiProperty({
    description: 'Metric value',
    example: 85.5,
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Date of the metric',
    example: '2024-01-15T00:00:00.000Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  date: Date;
}
