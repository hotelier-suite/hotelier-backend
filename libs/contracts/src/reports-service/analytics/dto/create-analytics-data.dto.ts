import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { AnalyticsMetric } from '..';

export class CreateAnalyticsDataDto {
  @ApiProperty({
    description: 'Type of analytics metric being recorded',
    enum: AnalyticsMetric,
    example: AnalyticsMetric.OCCUPANCY_RATE,
  })
  @IsEnum(AnalyticsMetric)
  metric: AnalyticsMetric;

  @ApiProperty({
    description: 'Numeric value of the metric',
    example: 85.75,
  })
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Date when the metric was recorded',
    example: '2024-01-15',
    format: 'date',
  })
  @IsDate()
  date: Date;

  @ApiProperty({
    description: 'Time period identifier (e.g., "Q1-2024", "Jan-2024")',
    example: 'Q1-2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  period?: string;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    example: { source: 'manual', department: 'front-desk' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
