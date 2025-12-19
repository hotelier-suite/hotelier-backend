import { ApiProperty } from '@nestjs/swagger';
import { GuestType } from '../enums/guest-type.enum';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';
import type { ParkingSpaceDto } from '../../spaces/dto/parking-space.dto';
import type { ParkingIncidentDto } from '../../incidents/dto/parking-incident.dto';

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
