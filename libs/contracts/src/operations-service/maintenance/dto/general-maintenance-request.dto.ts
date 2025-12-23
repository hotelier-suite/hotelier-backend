import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { MaintenanceStatus } from '../enums/maintenance-status.enum';
import { MaintenancePriority } from '../enums/maintenance-priority.enum';
import { MaintenanceType } from '../enums/maintenance-type.enum';

export class GeneralMaintenanceRequestDto {
  @ApiProperty({ description: 'Maintenance request unique identifier', example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ description: 'Maintenance request title', example: 'Fix air conditioning in room 205' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({ description: 'Detailed description of the maintenance request', example: 'The air conditioning unit is not working properly and making noise.', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({ description: 'Type of maintenance', enum: MaintenanceType, example: MaintenanceType.CORRECTIVE })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({ description: 'Priority level', enum: MaintenancePriority, example: MaintenancePriority.HIGH })
  @IsEnum(MaintenancePriority)
  priority: MaintenancePriority;

  @ApiProperty({ description: 'Current status', enum: MaintenanceStatus, example: MaintenanceStatus.SCHEDULED, required: false })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  status?: MaintenanceStatus;

  @ApiProperty({ description: 'Location where maintenance is needed', example: 'Room 205' })
  @IsString()
  @Length(1, 100)
  location: string;

  @ApiProperty({ description: 'Equipment or asset requiring maintenance', example: 'Air Conditioning Unit', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  equipment?: string;

  @ApiProperty({ description: 'Scheduled date for maintenance', example: '2024-12-15', required: false })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  scheduledDate?: Date;

  @ApiProperty({ description: 'Scheduled start time', example: '09:00', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  scheduledStartTime?: string;

  @ApiProperty({ description: 'Estimated duration in hours', example: 2.5, minimum: 0, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  estimatedDuration?: number;

  @ApiProperty({ description: 'Estimated cost for maintenance', example: 150.0, minimum: 0, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  estimatedCost?: number;

  @ApiProperty({ description: 'Actual cost for maintenance', example: 175.0, minimum: 0, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  actualCost?: number;

  @ApiProperty({ description: 'ID of the assigned technician', example: 1, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  assignedTechnicianId?: number;

  @ApiProperty({ description: 'ID of the employee who requested maintenance', example: 2, required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  requestedById?: number;

  @ApiProperty({ description: 'Date when maintenance was started', example: '2024-12-15T09:00:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startedAt?: Date;

  @ApiProperty({ description: 'Date when maintenance was completed', example: '2024-12-15T11:30:00.000Z', required: false })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiProperty({ description: 'Work performed or completion notes', example: 'Replaced faulty compressor and cleaned filters.', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  workPerformed?: string;

  @ApiProperty({ description: 'Materials used during maintenance', example: 'Compressor unit, air filters, refrigerant', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  materialsUsed?: string;

  @ApiProperty({ description: 'Maintenance request creation timestamp', example: '2024-01-15T10:30:00.000Z' })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Maintenance request last update timestamp', example: '2024-01-15T14:20:00.000Z' })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
