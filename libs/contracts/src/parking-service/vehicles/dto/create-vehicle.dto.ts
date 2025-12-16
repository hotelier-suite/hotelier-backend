import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { GuestType } from '../enums/guest-type.enum';
import { VehicleType } from '../enums/vehicle-type.enum';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-123' })
  @IsString()
  @Length(1, 20)
  licensePlate: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @Length(1, 50)
  brand: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  @Length(1, 50)
  model: string;

  @ApiProperty({ example: 'Blue' })
  @IsString()
  @Length(1, 30)
  color: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @Length(1, 100)
  owner: string;

  @ApiProperty({ required: false, example: '201' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  room?: string;

  @ApiProperty({ enum: GuestType, example: GuestType.GUEST })
  @IsEnum(GuestType)
  guestType: GuestType;

  @ApiProperty({ required: false, example: 'G-002' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  assignedSpace?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
