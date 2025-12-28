import { IsOptional, IsEnum, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ReportType } from '../enums/report-type.enum';
import { ReportStatus } from '../enums/report-status.enum';

export class FindReportsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter by report type',
    enum: ReportType,
    example: ReportType.OCCUPANCY,
  })
  @IsOptional()
  @IsEnum(ReportType)
  type?: ReportType;

  @ApiPropertyOptional({
    description: 'Filter by report status',
    enum: ReportStatus,
    example: ReportStatus.COMPLETED,
  })
  @IsOptional()
  @IsEnum(ReportStatus)
  status?: ReportStatus;

  @ApiPropertyOptional({
    description: 'Filter by start date (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter by end date (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
