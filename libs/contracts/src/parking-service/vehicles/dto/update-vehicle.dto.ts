import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVehicleDto } from './create-vehicle.dto';
import { VehicleStatus } from '../enums';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiProperty({ required: false, enum: VehicleStatus })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  exitTime?: Date;
}
