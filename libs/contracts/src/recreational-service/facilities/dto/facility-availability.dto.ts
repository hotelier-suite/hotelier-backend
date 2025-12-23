import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsArray, IsString, IsOptional, IsInt } from 'class-validator';

export class TimeSlotDto {
  @ApiProperty({
    description: 'Start time of the slot',
    example: '14:00',
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    description: 'End time of the slot',
    example: '15:00',
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    description: 'Whether this slot is available',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Reason if not available',
    example: 'Already booked',
    required: false,
  })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class FacilityAvailabilityDto {
  @ApiProperty({
    description: 'Facility ID',
    example: 1,
  })
  @IsInt()
  facilityId: number;

  @ApiProperty({
    description: 'Facility name',
    example: 'Olympic Swimming Pool',
  })
  @IsString()
  facilityName: string;

  @ApiProperty({
    description: 'Date being checked',
    example: '2024-12-15',
  })
  @IsString()
  date: string;

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
