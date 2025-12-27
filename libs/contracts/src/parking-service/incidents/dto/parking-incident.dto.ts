import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority } from '@app/contracts/common';
import { IncidentStatus, IncidentType } from '..';
import type { VehicleDto } from '../../vehicles';
import type { ParkingSpaceDto } from '../../spaces';

export class ParkingIncidentDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ enum: IncidentType, example: IncidentType.VEHICLE_DAMAGE })
  @IsEnum(IncidentType)
  type: IncidentType;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  reportDate: Date;

  @ApiProperty({ enum: IncidentStatus, example: IncidentStatus.PENDING })
  @IsEnum(IncidentStatus)
  status: IncidentStatus;

  @ApiProperty()
  @IsString()
  responsible: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.NORMAL })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resolution?: string;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  resolvedAt?: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  vehicleId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  spaceId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  vehicle?: VehicleDto;

  @ApiProperty({ required: false })
  @IsOptional()
  space?: ParkingSpaceDto;
}
