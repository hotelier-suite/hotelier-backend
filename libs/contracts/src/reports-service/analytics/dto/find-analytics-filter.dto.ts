import { IsOptional, IsEnum, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { AnalyticsMetric } from '../enums';

export class FindAnalyticsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter analytics by metric type',
    enum: AnalyticsMetric,
    example: AnalyticsMetric.OCCUPANCY_RATE,
  })
  @IsOptional()
  @IsEnum(AnalyticsMetric)
  type?: AnalyticsMetric;

  @ApiPropertyOptional({
    description: 'Filter analytics from this date (YYYY-MM-DD)',
    type: Date,
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter analytics until this date (YYYY-MM-DD)',
    type: Date,
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
