import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SpaceStatus, SpaceType } from '..';
import type { VehicleDto } from '../../vehicles';
import type { ParkingIncidentDto } from '../../incidents';

export class ParkingSpaceDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'G-001' })
  @IsString()
  code: string;

  @ApiProperty({ example: 'Ground Floor' })
  @IsString()
  zone: string;

  @ApiProperty({ enum: SpaceType, example: SpaceType.GUEST })
  @IsEnum(SpaceType)
  type: SpaceType;

  @ApiProperty({ enum: SpaceStatus, example: SpaceStatus.AVAILABLE })
  @IsEnum(SpaceStatus)
  status: SpaceStatus;

  @ApiProperty({ required: false, example: 'ABC-123' })
  @IsOptional()
  @IsString()
  currentVehicle?: string;

  @ApiProperty({ example: 5.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate: number;

  @ApiProperty({ example: 'Ground Floor - Row A' })
  @IsString()
  location: string;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  vehicles?: VehicleDto[];

  @ApiProperty({ required: false })
  @IsOptional()
  incidents?: ParkingIncidentDto[];
}
