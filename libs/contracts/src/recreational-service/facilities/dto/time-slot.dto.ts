import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsMilitaryTime,
  IsOptional,
  IsString,
} from 'class-validator';

export class TimeSlotDto {
  @ApiProperty({
    description: 'Start time of the slot',
    example: '14:00',
  })
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({
    description: 'End time of the slot',
    example: '15:00',
  })
  @IsMilitaryTime()
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
