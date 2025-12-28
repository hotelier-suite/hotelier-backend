import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { ReportType, ReportStatus } from '..';
import { ReportParametersDto } from './report-parameters.dto';

export class CreateReportDto {
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
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'End date for the report data',
    example: '2024-01-31',
    format: 'date',
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
  @ValidateNested()
  @Type(() => ReportParametersDto)
  parameters?: ReportParametersDto;

  @ApiProperty({
    description: 'Username or ID of the person who generated the report',
    example: 'admin@hotel.com',
    maxLength: 100,
  })
  @IsString()
  @Length(1, 100)
  generatedBy: string;
}
