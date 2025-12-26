import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { AnalyticsMetric } from '..';

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
  })
  @Type(() => Date)
  @IsDate()
  date: Date;
}
