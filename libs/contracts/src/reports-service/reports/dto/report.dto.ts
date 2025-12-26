import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ReportType } from '../enums';
import { ReportStatus } from '../enums';
import { ReportParametersDto } from './report-parameters.dto';

export class ReportDto {
  @ApiProperty({ description: 'Unique identifier for the report', example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Title of the report',
    example: 'Monthly Occupancy Report - January 2024',
    maxLength: 200,
  })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'Type of report being generated',
    enum: ReportType,
    example: ReportType.OCCUPANCY,
  })
  @IsEnum(ReportType)
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
  status?: ReportStatus;

  @ApiProperty({
    description: 'Start date for the report data',
    example: '2024-01-01',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date for the report data',
    example: '2024-01-31',
  })
  @Type(() => Date)
  @IsDate()
  endDate: Date;

  @ApiProperty({
    description: 'Additional parameters for report generation',
    type: ReportParametersDto,
    required: false,
  })
  @IsOptional()
  parameters?: ReportParametersDto;

  @ApiProperty({
    description: 'Generated report data in JSON format',
    example: { totalRooms: 150, occupiedRooms: 120, occupancyRate: 80 },
    required: false,
  })
  @IsOptional()
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
  filePath?: string;

  @ApiProperty({
    description: 'Username or ID of the person who generated the report',
    example: 'admin@hotel.com',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  generatedBy: string;

  @ApiProperty({ description: 'Report creation timestamp' })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({ description: 'Report last update timestamp' })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
