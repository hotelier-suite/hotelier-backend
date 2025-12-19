import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString, Length, Min } from 'class-validator';
import { SpaceType } from '../enums/space-type.enum';

export class CreateParkingSpaceDto {
  @ApiProperty({ example: 'G-001' })
  @IsString()
  @Length(1, 20)
  code: string;

  @ApiProperty({ example: 'Ground Floor' })
  @IsString()
  @Length(1, 50)
  zone: string;

  @ApiProperty({ enum: SpaceType, example: SpaceType.GUEST })
  @IsEnum(SpaceType)
  type: SpaceType;

  @ApiProperty({ example: 5.0, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate: number;

  @ApiProperty({ example: 'Ground Floor - Row A' })
  @IsString()
  @Length(1, 100)
  location: string;
}
