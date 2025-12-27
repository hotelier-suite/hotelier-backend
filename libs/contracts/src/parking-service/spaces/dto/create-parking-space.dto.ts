import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Length, Min } from 'class-validator';
import { SpaceType } from '..';

export class CreateParkingSpaceDto {
  @ApiProperty({
    description: 'Unique code identifying the parking space',
    example: 'G-001',
  })
  @IsString()
  @Length(1, 20)
  code: string;

  @ApiProperty({
    description: 'Zone or area where the parking space is located',
    example: 'Ground Floor',
  })
  @IsString()
  @Length(1, 50)
  zone: string;

  @ApiProperty({
    description: 'Type of parking space',
    enum: SpaceType,
    example: SpaceType.GUEST,
  })
  @IsEnum(SpaceType)
  type: SpaceType;

  @ApiProperty({
    description: 'Hourly rate charged for using this parking space in USD',
    example: 5.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate: number;

  @ApiProperty({
    description: 'Physical location description of the parking space',
    example: 'Ground Floor - Row A',
  })
  @IsString()
  @Length(1, 100)
  location: string;
}
