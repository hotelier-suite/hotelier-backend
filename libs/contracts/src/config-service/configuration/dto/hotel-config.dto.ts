import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsEmail, IsMilitaryTime, Min } from 'class-validator';

export class HotelConfigDto {
  @ApiProperty({
    description: 'Hotel configuration unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Hotel property name',
    example: 'Grand Hotel Plaza',
  })
  @IsString()
  propertyName: string;

  @ApiProperty({
    description: 'Hotel property address',
    example: '123 Main Street, City, State 12345',
  })
  @IsString()
  propertyAddress: string;

  @ApiProperty({
    description: 'Hotel property phone number',
    example: '+1-555-123-4567',
  })
  @IsString()
  propertyPhone: string;

  @ApiProperty({
    description: 'Hotel property email address',
    example: 'info@grandhotelplaza.com',
  })
  @IsEmail()
  propertyEmail: string;

  @ApiProperty({
    description: 'Standard check-in time',
    example: '15:00',
  })
  @IsMilitaryTime()
  checkInTime: string;

  @ApiProperty({
    description: 'Standard check-out time',
    example: '11:00',
  })
  @IsMilitaryTime()
  checkOutTime: string;

  @ApiProperty({
    description: 'Hotel cancellation policy',
    example: '24 hours before arrival',
  })
  @IsString()
  cancellationPolicy: string;

  @ApiProperty({
    description: 'Hotel timezone',
    example: 'America/New_York',
  })
  @IsString()
  timeZone: string;
}
