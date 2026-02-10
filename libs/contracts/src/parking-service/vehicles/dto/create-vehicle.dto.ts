import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { GuestType, VehicleType } from '../enums';

export class CreateVehicleDto {
  @ApiProperty({
    description: 'License plate number of the vehicle',
    example: 'ABC-123',
  })
  @IsString()
  @Length(1, 20)
  @Transform(({ value }: { value: string }) => value?.toUpperCase().trim())
  licensePlate: string;

  @ApiProperty({
    description: 'Brand or manufacturer of the vehicle',
    example: 'Toyota',
  })
  @IsString()
  @Length(1, 50)
  @Transform(({ value }: { value: string }) => value?.trim())
  brand: string;

  @ApiProperty({ description: 'Model name of the vehicle', example: 'Camry' })
  @IsString()
  @Length(1, 50)
  @Transform(({ value }: { value: string }) => value?.trim())
  model: string;

  @ApiProperty({ description: 'Color of the vehicle', example: 'Blue' })
  @IsString()
  @Length(1, 30)
  @Transform(({ value }: { value: string }) => value?.trim())
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
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
  owner: string;

  @ApiProperty({
    description: 'Room number associated with the vehicle owner',
    required: false,
    example: '201',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  room?: string;

  @ApiProperty({
    description: 'Type of guest associated with the vehicle',
    enum: GuestType,
    example: GuestType.GUEST,
  })
  @IsEnum(GuestType)
  guestType: GuestType;

  @ApiProperty({
    description: 'Code of the parking space to assign to this vehicle',
    required: false,
    example: 'G-002',
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  assignedSpace?: string;

  @ApiProperty({
    description: 'Additional notes or comments about the vehicle',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
