import {
  ApiProperty,
  ApiExtraModels,
  getSchemaPath,
  PartialType,
} from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { CreateReportDto } from './create-report.dto';
import { OccupancyReportDataDto } from './occupancy-report-data.dto';
import { RevenueReportDataDto } from './revenue-report-data.dto';
import { FinancialSummaryDto } from './financial-summary.dto';
import { StaffReportDataDto } from './staff-report-data.dto';
import { GuestSatisfactionReportDataDto } from './guest-satisfaction-report-data.dto';
import { MaintenanceReportDataDto } from './maintenance-report-data.dto';
import { CustomReportDataDto } from './custom-report-data.dto';
import type { ReportData } from '../types';

@ApiExtraModels(
  OccupancyReportDataDto,
  RevenueReportDataDto,
  FinancialSummaryDto,
  StaffReportDataDto,
  GuestSatisfactionReportDataDto,
  MaintenanceReportDataDto,
  CustomReportDataDto,
)
export class UpdateReportDto extends PartialType(CreateReportDto) {
  @ApiProperty({
    description:
      'Generated report data. Structure depends on report type: OCCUPANCY → OccupancyReportDataDto, REVENUE → RevenueReportDataDto, FINANCIAL → FinancialSummaryDto, STAFF → StaffReportDataDto, GUEST_SATISFACTION → GuestSatisfactionReportDataDto, MAINTENANCE → MaintenanceReportDataDto, CUSTOM → CustomReportDataDto',
    required: false,
    oneOf: [
      { $ref: getSchemaPath(OccupancyReportDataDto) },
      { $ref: getSchemaPath(RevenueReportDataDto) },
      { $ref: getSchemaPath(FinancialSummaryDto) },
      { $ref: getSchemaPath(StaffReportDataDto) },
      { $ref: getSchemaPath(GuestSatisfactionReportDataDto) },
      { $ref: getSchemaPath(MaintenanceReportDataDto) },
      { $ref: getSchemaPath(CustomReportDataDto) },
    ],
  })
  @IsOptional()
  data?: ReportData;

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
}
