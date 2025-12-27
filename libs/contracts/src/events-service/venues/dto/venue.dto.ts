import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class VenueDto {
  @ApiProperty({ description: 'Unique identifier for the venue', example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ description: 'Venue name', example: 'Grand Ballroom' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ description: 'Maximum capacity of the venue', example: 200 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Area of the venue in square meters',
    example: 400.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  area: number;

  @ApiProperty({ description: 'Hourly rate for venue rental', example: 500.0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate: number;

  @ApiProperty({
    description: 'Whether the venue is available for booking',
    example: true,
  })
  @IsBoolean()
  available: boolean;

  @ApiProperty({
    description: 'Venue location within the hotel',
    example: 'Main Building - Ground Floor',
  })
  @IsString()
  @Length(1, 200)
  location: string;

  @ApiProperty({
    description: 'Venue description and features',
    example: 'Elegant ballroom perfect for weddings and corporate events',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  description?: string;

  @ApiProperty({ description: 'Creation timestamp', format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Last update timestamp', format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
