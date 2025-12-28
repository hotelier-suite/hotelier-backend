import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { IsDate, IsEnum, IsOptional } from 'class-validator';
import { CreateVehicleDto } from './create-vehicle.dto';
import { VehicleStatus } from '../enums';

export class UpdateVehicleDto extends PartialType(CreateVehicleDto) {
  @ApiProperty({
    description: 'Current status of the vehicle in the parking system',
    required: false,
    enum: VehicleStatus,
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiProperty({
    description: 'Timestamp when the vehicle exited the parking facility',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @IsDate()
  exitTime?: Date;
}
