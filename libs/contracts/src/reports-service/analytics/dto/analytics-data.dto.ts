import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
  IsObject,
  IsInt,
  Min,
} from 'class-validator';
import { AnalyticsMetric } from '../enums';

export class AnalyticsDataDto {
  @ApiProperty({
    description: 'Analytics data unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

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
  @Type(() => Date)
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

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2024-01-15T11:45:00.000Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
