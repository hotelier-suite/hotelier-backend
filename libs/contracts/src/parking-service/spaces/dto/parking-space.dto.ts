import { ApiProperty } from '@nestjs/swagger';
import { SpaceStatus, SpaceType } from '..';
import type { VehicleDto } from '../../vehicles';
import type { ParkingIncidentDto } from '../../incidents';

export class ParkingSpaceDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'G-001' })
  code: string;

  @ApiProperty({ example: 'Ground Floor' })
  zone: string;

  @ApiProperty({ enum: SpaceType, example: SpaceType.GUEST })
  type: SpaceType;

  @ApiProperty({ enum: SpaceStatus, example: SpaceStatus.AVAILABLE })
  status: SpaceStatus;

  @ApiProperty({ required: false, example: 'ABC-123' })
  currentVehicle?: string;

  @ApiProperty({ example: 5.0 })
  hourlyRate: number;

  @ApiProperty({ example: 'Ground Floor - Row A' })
  location: string;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ required: false })
  vehicles?: VehicleDto[];

  @ApiProperty({ required: false })
  incidents?: ParkingIncidentDto[];
}
