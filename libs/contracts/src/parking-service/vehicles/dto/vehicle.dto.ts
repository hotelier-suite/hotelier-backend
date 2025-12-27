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
import { GuestType, VehicleStatus, VehicleType } from '..';
import type { ParkingSpaceDto } from '../../spaces';
import type { ParkingIncidentDto } from '../../incidents';

export class VehicleDto {
  @ApiProperty({ description: 'Unique identifier for the vehicle', example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'License plate number of the vehicle',
    example: 'ABC-123',
  })
  @IsString()
  licensePlate: string;

  @ApiProperty({
    description: 'Brand or manufacturer of the vehicle',
    example: 'Toyota',
  })
  @IsString()
  brand: string;

  @ApiProperty({ description: 'Model name of the vehicle', example: 'Camry' })
  @IsString()
  model: string;

  @ApiProperty({ description: 'Color of the vehicle', example: 'Blue' })
  @IsString()
  color: string;

  @ApiProperty({
    description: 'Type of vehicle',
    enum: VehicleType,
    example: VehicleType.CAR,
  })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({
    description: 'Name of the vehicle owner',
    example: 'John Smith',
  })
  @IsString()
  owner: string;

  @ApiProperty({
    description: 'Room number associated with the vehicle owner',
    required: false,
    example: '201',
  })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiProperty({
    description: 'Type of guest associated with the vehicle',
    enum: GuestType,
    example: GuestType.GUEST,
  })
  @IsEnum(GuestType)
  guestType: GuestType;

  @ApiProperty({
    description: 'Code of the parking space assigned to this vehicle',
    required: false,
    example: 'G-002',
  })
  @IsOptional()
  @IsString()
  assignedSpace?: string;

  @ApiProperty({
    description: 'Timestamp when the vehicle entered the parking facility',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  entryTime: Date;

  @ApiProperty({
    description: 'Timestamp when the vehicle exited the parking facility',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  exitTime?: Date;

  @ApiProperty({
    description: 'Current status of the vehicle in the parking system',
    enum: VehicleStatus,
    example: VehicleStatus.PARKED,
  })
  @IsEnum(VehicleStatus)
  status: VehicleStatus;

  @ApiProperty({
    description: 'Additional notes or comments about the vehicle',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Timestamp when the vehicle record was created',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the vehicle record was last updated',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: 'Parking space details where the vehicle is parked',
    required: false,
  })
  @IsOptional()
  space?: ParkingSpaceDto;

  @ApiProperty({
    description: 'List of incidents associated with this vehicle',
    required: false,
  })
  @IsOptional()
  incidents?: ParkingIncidentDto[];
}
