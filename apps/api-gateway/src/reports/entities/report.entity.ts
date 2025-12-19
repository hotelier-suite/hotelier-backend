import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsDate,
  IsOptional,
  IsInt,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';
import { ReportParametersDto } from '../dto/report-parameters.dto';

@Entity('reports')
export class Report {
  @ApiProperty({ description: 'Unique identifier for the report', example: 1 })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Title of the report',
    example: 'Monthly Occupancy Report - January 2024',
    maxLength: 200,
  })
  @IsString()
  @Length(1, 200)
  @Column()
  title: string;

  @ApiProperty({
    description: 'Type of report being generated',
    enum: ReportType,
    example: ReportType.OCCUPANCY,
  })
  @IsEnum(ReportType)
  @Column({
    type: 'enum',
    enum: ReportType,
  })
  type: ReportType;

  @ApiProperty({
    description: 'Current status of the report',
    enum: ReportStatus,
    example: ReportStatus.PENDING,
    default: ReportStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(ReportStatus)
  @Column({
    type: 'enum',
    enum: ReportStatus,
    default: ReportStatus.PENDING,
  })
  status?: ReportStatus;

  @ApiProperty({
    description: 'Start date for the report data',
    example: '2024-01-01',
  })
  @Type(() => Date)
  @IsDate()
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({
    description: 'End date for the report data',
    example: '2024-01-31',
  })
  @Type(() => Date)
  @IsDate()
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({
    description: 'Additional parameters for report generation',
    type: ReportParametersDto,
    required: false,
  })
  @IsOptional()
  @Column('json', { nullable: true })
  parameters?: ReportParametersDto;

  @ApiProperty({
    description: 'Generated report data in JSON format',
    example: { totalRooms: 150, occupiedRooms: 120, occupancyRate: 80 },
    required: false,
    oneOf: [
      { $ref: '#/components/schemas/OccupancyReportDataDto' },
      { $ref: '#/components/schemas/RevenueReportDataDto' },
    ],
  })
  @IsOptional()
  @Column('json', { nullable: true })
  data?: object;

  @ApiProperty({
    description: 'File path where the report is stored',
    example: '/reports/2024/01/occupancy-report-2024-01.pdf',
    required: false,
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Column({ nullable: true })
  filePath?: string;

  @ApiProperty({
    description: 'Username or ID of the person who generated the report',
    example: 'admin@hotel.com',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  @Column()
  generatedBy: string;

  @ApiProperty({ description: 'Report creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Report last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;
}
