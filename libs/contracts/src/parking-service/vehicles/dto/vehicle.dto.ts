import { ApiProperty } from '@nestjs/swagger';
import { GuestType, VehicleStatus, VehicleType } from '..';
import type { ParkingSpaceDto } from '../../spaces';
import type { ParkingIncidentDto } from '../../incidents';

export class VehicleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'ABC-123' })
  licensePlate: string;

  @ApiProperty({ example: 'Toyota' })
  brand: string;

  @ApiProperty({ example: 'Camry' })
  model: string;

  @ApiProperty({ example: 'Blue' })
  color: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  type: VehicleType;

  @ApiProperty({ example: 'John Smith' })
  owner: string;

  @ApiProperty({ required: false, example: '201' })
  room?: string;

  @ApiProperty({ enum: GuestType, example: GuestType.GUEST })
  guestType: GuestType;

  @ApiProperty({ required: false, example: 'G-002' })
  assignedSpace?: string;

  @ApiProperty({ type: String })
  entryTime: Date;

  @ApiProperty({ required: false, type: String })
  exitTime?: Date;

  @ApiProperty({ enum: VehicleStatus, example: VehicleStatus.PARKED })
  status: VehicleStatus;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;

  @ApiProperty({ required: false })
  space?: ParkingSpaceDto;

  @ApiProperty({ required: false })
  incidents?: ParkingIncidentDto[];
}
