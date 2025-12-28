import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { EventStatus } from '..';

export class CreateEventDto {
  @ApiProperty({
    description: 'Event title',
    example: 'Annual Corporate Retreat',
  })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({
    description: 'Event description',
    example: 'Company-wide retreat focusing on team building.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({
    description: 'Event date',
    example: '2024-12-15',
    format: 'date',
  })
  @IsDate()
  eventDate: Date;

  @ApiProperty({
    description: 'Event start time',
    example: '09:00',
    format: 'time',
  })
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({
    description: 'Event end time',
    example: '17:00',
    required: false,
    format: 'time',
  })
  @IsOptional()
  @IsMilitaryTime()
  endTime?: string;

  @ApiProperty({ description: 'Event venue', example: 'Conference Room Alpha' })
  @IsString()
  @Length(1, 100)
  venue: string;

  @ApiProperty({ description: 'Venue capacity', example: 50, minimum: 1 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({
    description: 'Number of attendees',
    example: 45,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  attendees?: number;

  @ApiProperty({
    description: 'Event status',
    enum: EventStatus,
    example: EventStatus.PLANNED,
    required: false,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty({ description: 'Event organizer', example: 'TechCorp Inc.' })
  @IsString()
  @Length(1, 100)
  organizer: string;

  @ApiProperty({
    description: 'Event cost',
    example: 1200.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiProperty({
    description: 'Event revenue',
    example: 2500.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  revenue?: number;
}
