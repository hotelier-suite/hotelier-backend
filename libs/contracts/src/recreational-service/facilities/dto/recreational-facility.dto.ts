import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import { FacilityType } from '../enums/facility-type.enum';
import { FacilityStatus } from '../enums/facility-status.enum';

export class RecreationalFacilityDto {
  @ApiProperty({
    description: 'Recreational facility unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Facility name',
    example: 'Olympic Swimming Pool',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Type of recreational facility',
    enum: FacilityType,
    example: FacilityType.SWIMMING_POOL,
  })
  @IsEnum(FacilityType)
  type: FacilityType;

  @ApiProperty({
    description: 'Current facility status',
    enum: FacilityStatus,
    example: FacilityStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FacilityStatus)
  status?: FacilityStatus;

  @ApiProperty({
    description: 'Maximum capacity of the facility',
    example: 20,
  })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Facility area in square meters',
    example: 200.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  area?: number;

  @ApiProperty({
    description: 'Facility location within the hotel',
    example: 'Wellness Center - 2nd Floor',
  })
  @IsString()
  @Length(1, 200)
  location: string;

  @ApiProperty({
    description: 'Facility description and features',
    example: 'Heated outdoor pool with lap lanes and children area',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({
    description: 'Hourly rate for facility booking',
    example: 25.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  hourlyRate?: number;

  @ApiProperty({
    description: 'Whether the facility is currently available for booking',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Operating hours start time',
    example: '06:00',
  })
  @IsString()
  @Length(5, 5)
  openingTime: string;

  @ApiProperty({
    description: 'Operating hours end time',
    example: '22:00',
  })
  @IsString()
  @Length(5, 5)
  closingTime: string;

  @ApiProperty({
    description: 'Minimum booking duration in hours',
    example: 1,
    minimum: 1,
    maximum: 24,
  })
  @IsInt()
  @Min(1)
  @Max(24)
  minimumBookingHours: number;

  @ApiProperty({
    description: 'Maximum booking duration in hours',
    example: 4,
    minimum: 1,
    maximum: 24,
  })
  @IsInt()
  @Min(1)
  @Max(24)
  maximumBookingHours: number;

  @ApiProperty({
    description: 'Required equipment or amenities',
    example: ['Pool towels', 'Swimming caps required', 'Lifeguard on duty'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  amenities?: string[];

  @ApiProperty({
    description: 'Special rules and requirements',
    example: ['No outside food', 'Children under 12 must be supervised'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  rules?: string[];

  @ApiProperty({
    description: 'Advance booking required in hours',
    example: 2,
    minimum: 0,
    maximum: 168,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(168)
  advanceBookingHours?: number;

  @ApiProperty({
    description: 'Days of the week when facility is available (0=Sunday, 6=Saturday)',
    example: [1, 2, 3, 4, 5, 6, 0],
    required: false,
  })
  @IsOptional()
  @IsArray()
  availableDays?: number[];

  @ApiProperty({
    description: 'Maintenance schedule notes',
    example: 'Daily cleaning 5:00-6:00 AM',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  maintenanceNotes?: string;

  @ApiProperty({
    description: 'Facility creation timestamp',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Facility last update timestamp',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
