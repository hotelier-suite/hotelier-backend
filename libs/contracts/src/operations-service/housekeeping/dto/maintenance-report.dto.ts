import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { HousekeepingMaintenanceType, HousekeepingMaintenanceStatus } from '..';
import { TaskPriority } from '@app/contracts/common';

export class MaintenanceReportDto {
  @ApiProperty({
    description: 'Unique identifier for the maintenance report',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ description: 'Unique report number', example: 'MR-2024-001' })
  @IsString()
  @Length(1, 50)
  reportNumber: string;

  @ApiProperty({
    description: 'Type of maintenance required',
    enum: HousekeepingMaintenanceType,
    example: HousekeepingMaintenanceType.PLUMBING,
  })
  @IsEnum(HousekeepingMaintenanceType)
  type: HousekeepingMaintenanceType;

  @ApiProperty({
    description: 'Detailed description of the maintenance issue',
    example: 'Bathroom faucet leaking, needs immediate attention',
  })
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiProperty({
    description: 'Priority level of the maintenance task',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    description: 'Current status of the maintenance report',
    enum: HousekeepingMaintenanceStatus,
    example: HousekeepingMaintenanceStatus.PENDING,
  })
  @IsEnum(HousekeepingMaintenanceStatus)
  status: HousekeepingMaintenanceStatus;

  @ApiProperty({
    description: 'Name of the technician assigned to this maintenance',
    example: 'Luis Fernandez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  assignedTechnician?: string;

  @ApiProperty({
    description: 'Name of the person who reported the issue',
    example: 'Mary Johnson',
  })
  @IsString()
  @Length(1, 100)
  reportedBy: string;

  @ApiProperty({
    description: 'Estimated time to complete the maintenance',
    example: '2 hours',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  estimatedTime?: string;

  @ApiProperty({
    description: 'Date and time when maintenance work started',
    example: '2024-01-15T09:00:00Z',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startedAt?: Date;

  @ApiProperty({
    description: 'Date and time when maintenance work was completed',
    example: '2024-01-15T11:00:00Z',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiProperty({
    description: 'Total cost of the maintenance work',
    example: 150.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiProperty({
    description: 'Additional notes about the maintenance work',
    example: 'All filters replaced, system running optimally',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;

  @ApiProperty({
    description: 'ID of the room where maintenance is required',
    example: 101,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  roomId?: number;

  @ApiProperty({
    description: 'Date when the record was created',
    example: '2024-01-15T08:00:00Z',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the record was last updated',
    example: '2024-01-15T11:00:00Z',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
