import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEmail,
  IsMilitaryTime,
  IsUrl,
} from 'class-validator';

export class UpdateHotelConfigDto {
  @ApiProperty({
    description: 'Hotel name',
    example: 'Grand Hotel Plaza',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Hotel description',
    example: 'Luxury hotel in downtown area',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Hotel address',
    example: '123 Main Street, City, State 12345',
    required: false,
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    description: 'Hotel phone number',
    example: '+1-555-123-4567',
    required: false,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Hotel email address',
    example: 'info@grandhotelplaza.com',
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({
    description: 'Hotel website URL',
    example: 'https://www.grandhotelplaza.com',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    description: 'Standard check-in time',
    example: '15:00',
    required: false,
  })
  @IsOptional()
  @IsMilitaryTime()
  checkInTime?: string;

  @ApiProperty({
    description: 'Standard check-out time',
    example: '11:00',
    required: false,
  })
  @IsOptional()
  @IsMilitaryTime()
  checkOutTime?: string;

  @ApiProperty({
    description: 'Hotel language code',
    example: 'en',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'Hotel timezone',
    example: 'America/New_York',
    required: false,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiProperty({
    description: 'Hotel tax rate',
    example: '8.5',
    required: false,
  })
  @IsOptional()
  @IsString()
  taxRate?: string;
}
