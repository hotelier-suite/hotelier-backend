import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsArray,
  IsDate,
  IsString,
  IsOptional,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { TimeSlotDto } from './time-slot.dto';

export class FacilityAvailabilityDto {
  @ApiProperty({
    description: 'Facility ID',
    example: 1,
  })
  @IsInt()
  @Min(1)
  facilityId: number;

  @ApiProperty({
    description: 'Facility name',
    example: 'Olympic Swimming Pool',
  })
  @IsString()
  facilityName: string;

  @ApiProperty({
    description: 'Date being checked',
    type: String,
    example: '2024-12-15',
  })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({
    description: 'Whether the facility is available on this date',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Available time slots',
    type: [TimeSlotDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TimeSlotDto)
  availableSlots: TimeSlotDto[];

  @ApiProperty({
    description: 'General availability notes',
    example: 'Maintenance scheduled 5:00-6:00 AM',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
