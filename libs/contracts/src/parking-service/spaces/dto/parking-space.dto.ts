import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { SpaceStatus, SpaceType } from '../enums';
import type { VehicleDto } from '../../vehicles';
import type { ParkingIncidentDto } from '../../incidents';

export class ParkingSpaceDto {
  @ApiProperty({
    description: 'Unique identifier for the parking space',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Unique code identifying the parking space',
    example: 'G-001',
  })
  @IsString()
  code: string;

  @ApiProperty({
    description: 'Zone or area where the parking space is located',
    example: 'Ground Floor',
  })
  @IsString()
  zone: string;

  @ApiProperty({
    description: 'Type of parking space',
    enum: SpaceType,
    example: SpaceType.GUEST,
  })
  @IsEnum(SpaceType)
  type: SpaceType;

  @ApiProperty({
    description: 'Current availability status of the parking space',
    enum: SpaceStatus,
    example: SpaceStatus.AVAILABLE,
  })
  @IsEnum(SpaceStatus)
  status: SpaceStatus;

  @ApiProperty({
    description: 'License plate of the vehicle currently occupying this space',
    required: false,
    example: 'ABC-123',
  })
  @IsOptional()
  @IsString()
  currentVehicle?: string;

  @ApiProperty({
    description: 'Hourly rate charged for using this parking space in USD',
    example: 5.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate: number;

  @ApiProperty({
    description: 'Physical location description of the parking space',
    example: 'Ground Floor - Row A',
  })
  @IsString()
  location: string;

  @ApiProperty({
    description: 'Timestamp when the parking space record was created',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the parking space record was last updated',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'List of vehicles that have used this parking space',
    required: false,
  })
  @IsOptional()
  vehicles?: VehicleDto[];

  @ApiProperty({
    description: 'List of incidents associated with this parking space',
    required: false,
  })
  @IsOptional()
  incidents?: ParkingIncidentDto[];
}
