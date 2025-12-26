import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { TaskPriority } from '@app/contracts/common';
import { IncidentStatus, IncidentType } from '..';
import type { VehicleDto } from '../../vehicles';
import type { ParkingSpaceDto } from '../../spaces';

export class ParkingIncidentDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: IncidentType, example: IncidentType.VEHICLE_DAMAGE })
  type: IncidentType;

  @ApiProperty()
  description: string;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  reportDate: Date;

  @ApiProperty({ enum: IncidentStatus, example: IncidentStatus.PENDING })
  status: IncidentStatus;

  @ApiProperty()
  responsible: string;

  @ApiProperty({ enum: TaskPriority, example: TaskPriority.NORMAL })
  priority: TaskPriority;

  @ApiProperty({ required: false })
  resolution?: string;

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  resolvedAt?: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ required: false })
  vehicleId?: number;

  @ApiProperty({ required: false })
  spaceId?: number;

  @ApiProperty({ required: false })
  vehicle?: VehicleDto;

  @ApiProperty({ required: false })
  space?: ParkingSpaceDto;
}
