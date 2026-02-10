import { IsOptional, IsString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { GuestType } from '../enums/guest-type.enum';

export class FindVehiclesFilterDto {
  @ApiPropertyOptional({
    description: 'Filter vehicles by their current parking status',
    enum: VehicleStatus,
    example: VehicleStatus.PARKED,
  })
  @IsOptional()
  @IsEnum(VehicleStatus)
  status?: VehicleStatus;

  @ApiPropertyOptional({
    description: 'Filter vehicles by the type of guest',
    enum: GuestType,
    example: GuestType.GUEST,
  })
  @IsOptional()
  @IsEnum(GuestType)
  guestType?: GuestType;

  @ApiPropertyOptional({
    description: 'Filter vehicles by license plate (exact match)',
    example: 'ABC-1234',
  })
  @IsOptional()
  @IsString()
  licensePlate?: string;
}
