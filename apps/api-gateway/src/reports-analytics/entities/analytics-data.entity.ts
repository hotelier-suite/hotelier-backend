import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsDate,
  IsOptional,
  IsString,
  IsObject,
} from 'class-validator';
import { AnalyticsMetric } from '../enums/analytics-metric.enum';

@Entity('analytics_data')
export class AnalyticsData {
  @ApiProperty({
    description: 'Analytics data unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Type of analytics metric being recorded',
    enum: AnalyticsMetric,
    example: AnalyticsMetric.OCCUPANCY_RATE,
  })
  @IsEnum(AnalyticsMetric)
  @Column({
    type: 'enum',
    enum: AnalyticsMetric,
  })
  metric: AnalyticsMetric;

  @ApiProperty({
    description: 'Numeric value of the metric',
    example: 85.75,
  })
  @IsNumber()
  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @ApiProperty({
    description: 'Date when the metric was recorded',
    example: '2024-01-15',
  })
  @IsDate()
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({
    description: 'Time period identifier (e.g., "Q1-2024", "Jan-2024")',
    example: 'Q1-2024',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  period?: string;

  @ApiProperty({
    description: 'Additional metadata in JSON format',
    example: { source: 'manual', department: 'front-desk' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Column('json', { nullable: true })
  metadata?: Record<string, unknown>;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2024-01-15T11:45:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
