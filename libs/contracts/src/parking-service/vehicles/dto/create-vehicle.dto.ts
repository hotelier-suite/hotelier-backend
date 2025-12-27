import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { GuestType, VehicleType } from '..';

export class CreateVehicleDto {
  @ApiProperty({ example: 'ABC-123' })
  @IsString()
  @Length(1, 20)
  @Transform(({ value }: { value: string }) => value?.toUpperCase().trim())
  licensePlate: string;

  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @Length(1, 50)
  @Transform(({ value }: { value: string }) => value?.trim())
  brand: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  @Length(1, 50)
  @Transform(({ value }: { value: string }) => value?.trim())
  model: string;

  @ApiProperty({ example: 'Blue' })
  @IsString()
  @Length(1, 30)
  @Transform(({ value }: { value: string }) => value?.trim())
  color: string;

  @ApiProperty({ enum: VehicleType, example: VehicleType.CAR })
  @IsEnum(VehicleType)
  type: VehicleType;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
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
