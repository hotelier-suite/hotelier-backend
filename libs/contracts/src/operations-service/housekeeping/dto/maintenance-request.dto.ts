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

export class HousekeepingMaintenanceRequestDto {
  @ApiProperty({
    description: 'Unique identifier for the maintenance request',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Room number where maintenance is needed',
    example: '101',
  })
  @IsString()
  @Length(1, 10)
  roomNumber: string;

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
    description: 'Priority level of the maintenance request',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    description: 'Current status of the maintenance request',
    enum: HousekeepingMaintenanceStatus,
    example: HousekeepingMaintenanceStatus.PENDING,
  })
  @IsEnum(HousekeepingMaintenanceStatus)
  status: HousekeepingMaintenanceStatus;

  @ApiProperty({
    description: 'Name of the person who reported the issue',
    example: 'Mary Johnson',
  })
  @IsString()
  @Length(1, 100)
  reportedBy: string;

  @ApiProperty({
    description: 'Name of the person assigned to handle the request',
    example: 'Luis Fernandez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  assignedTo?: string;

  @ApiProperty({
    description: 'Date when the maintenance request was reported',
    example: '2024-01-15T08:00:00Z',
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  reportDate: Date;

  @ApiProperty({
    description: 'Date when the maintenance request was resolved',
    example: '2024-01-15T11:00:00Z',
    required: false,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  resolvedDate?: Date;

  @ApiProperty({
    description: 'Cost of the maintenance work',
    example: 75.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiProperty({
    description: 'Additional notes about the maintenance request',
    example: 'Urgent - guest complaint received',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;

  @ApiProperty({
    description: 'ID of the room where maintenance is needed',
    example: 101,
  })
  @IsInt()
  @Min(1)
  roomId: number;

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
