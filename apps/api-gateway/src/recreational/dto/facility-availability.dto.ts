import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsArray, IsString, IsOptional } from 'class-validator';
import { TimeSlot } from './time-slot.dto';

export class FacilityAvailabilityDto {
  @ApiProperty({
    description: 'Facility ID',
    example: 1,
  })
  facilityId: number;

  @ApiProperty({
    description: 'Facility name',
    example: 'Olympic Swimming Pool',
  })
  facilityName: string;

  @ApiProperty({
    description: 'Date being checked',
    example: '2024-12-15',
  })
  date: string;

  @ApiProperty({
    description: 'Whether the facility is available on this date',
    example: true,
  })
  @IsBoolean()
  isAvailable: boolean;

  @ApiProperty({
    description: 'Available time slots',
    type: [TimeSlot],
  })
  @IsArray()
  availableSlots: TimeSlot[];

  @ApiProperty({
    description: 'General availability notes',
    example: 'Maintenance scheduled 5:00-6:00 AM',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
