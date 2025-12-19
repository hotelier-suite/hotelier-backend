import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class TimeSlot {
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
