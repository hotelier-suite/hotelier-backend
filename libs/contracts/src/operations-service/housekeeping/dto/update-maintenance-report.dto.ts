import { PartialType } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { CreateMaintenanceReportDto } from './create-maintenance-report.dto';
import { HousekeepingMaintenanceStatus } from '../enums';

export class UpdateMaintenanceReportDto extends PartialType(
  CreateMaintenanceReportDto,
) {
  @ApiProperty({
    description: 'Current status of the maintenance report',
    enum: HousekeepingMaintenanceStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(HousekeepingMaintenanceStatus)
  status?: HousekeepingMaintenanceStatus;

  @ApiProperty({
    description: 'Name of the technician assigned to this maintenance',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  assignedTechnician?: string;

  @ApiProperty({
    description: 'Date and time when maintenance work started',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  startedAt?: Date;

  @ApiProperty({
    description: 'Date and time when maintenance work was completed',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  completedAt?: Date;

  @ApiProperty({
    description: 'Total cost of the maintenance work',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiProperty({
    description: 'Additional notes about the maintenance work',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
