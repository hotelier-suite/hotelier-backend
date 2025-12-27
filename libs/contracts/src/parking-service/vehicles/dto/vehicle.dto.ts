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
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'ABC-123' })
  @IsString()
  licensePlate: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  brand: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  model: string;

  @ApiProperty({ example: 'Blue' })
  @IsString()
  color: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  owner: string;

  @ApiProperty({ required: false, example: '201' })
  @IsOptional()
  @IsString()
  room?: string;

  @ApiProperty({ enum: GuestType, example: GuestType.GUEST })
  @IsEnum(GuestType)
  guestType: GuestType;

  @ApiProperty({ required: false, example: 'G-002' })
  @IsOptional()
  @IsString()
  assignedSpace?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  entryTime: Date;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  exitTime?: Date;

  @ApiProperty({ enum: VehicleStatus, example: VehicleStatus.PARKED })
  @IsEnum(VehicleStatus)
  status: VehicleStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

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
  space?: ParkingSpaceDto;

  @ApiProperty({ required: false })
  @IsOptional()
  incidents?: ParkingIncidentDto[];
}
