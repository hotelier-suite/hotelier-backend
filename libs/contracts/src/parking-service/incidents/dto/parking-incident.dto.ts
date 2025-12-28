import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { TaskPriority } from '@app/contracts/common';
import { IncidentStatus, IncidentType } from '..';
import type { VehicleDto } from '../../vehicles';
import type { ParkingSpaceDto } from '../../spaces';

export class ParkingIncidentDto {
  @ApiProperty({
    description: 'Unique identifier for the parking incident',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Type of parking incident',
    enum: IncidentType,
    example: IncidentType.VEHICLE_DAMAGE,
  })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiProperty({
    description: 'Detailed description of the parking incident',
    example: 'Vehicle scratched while parking',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Timestamp when the incident was reported',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  reportDate: Date;

  @ApiProperty({
    description: 'Current status of the incident',
    enum: IncidentStatus,
    example: IncidentStatus.PENDING,
  })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @ApiProperty({
    description: 'Name of the person responsible for handling the incident',
    example: 'John Smith',
  })
  @IsString()
  responsible: string;

  @ApiProperty({
    description: 'Priority level of the incident',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    description: 'Description of how the incident was resolved',
    required: false,
  })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiProperty({
    description: 'Timestamp when the incident was resolved',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  resolvedAt?: Date;

  @ApiProperty({
    description: 'Timestamp when the incident record was created',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the incident record was last updated',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the vehicle involved in the incident',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  vehicleId?: number;

  @ApiProperty({
    description: 'ID of the parking space where the incident occurred',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  spaceId?: number;

  @ApiProperty({
    description: 'Vehicle details involved in the incident',
    required: false,
  })
  @IsOptional()
  vehicle?: VehicleDto;

  @ApiProperty({
    description: 'Parking space details where the incident occurred',
    required: false,
  })
  @IsOptional()
  space?: ParkingSpaceDto;
}
