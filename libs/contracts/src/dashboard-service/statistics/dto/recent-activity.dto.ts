import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsString, IsDate } from 'class-validator';

export class RecentActivityDto {
  @ApiProperty({
    description: 'Activity type',
    example: 'check-in',
    enum: [
      'check-in',
      'check-out',
      'booking',
      'maintenance',
      'payment',
      'request',
    ],
  })
  @IsString()
  type: string;

  @ApiProperty({
    description: 'Activity description',
    example: 'Guest checked into Room 205',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Activity timestamp',
    example: '2024-01-15T10:30:00.000Z',
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  timestamp: Date;
}
