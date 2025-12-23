import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { EventStatus } from '../enums/event-status.enum';

export class EventDto {
  @ApiProperty({ description: 'Event unique identifier', example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ description: 'Event title', example: 'Annual Corporate Retreat' })
  @IsString()
  @Length(1, 200)
  title: string;

  @ApiProperty({ description: 'Event description', example: 'Company-wide retreat focusing on team building.', required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  description?: string;

  @ApiProperty({ description: 'Event date', example: '2024-12-15' })
  @IsDate()
  @Type(() => Date)
  eventDate: Date;

  @ApiProperty({ description: 'Event start time', example: '09:00' })
  @IsString()
  @Length(1, 20)
  startTime: string;

  @ApiProperty({ description: 'Event end time', example: '17:00', required: false })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  endTime?: string;

  @ApiProperty({ description: 'Event venue', example: 'Conference Room Alpha' })
  @IsString()
  @Length(1, 100)
  venue: string;

  @ApiProperty({ description: 'Venue capacity', example: 50, minimum: 1 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ description: 'Number of attendees', example: 45, minimum: 0, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  attendees?: number;

  @ApiProperty({ description: 'Event status', enum: EventStatus, example: EventStatus.PLANNED, required: false })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty({ description: 'Event organizer', example: 'TechCorp Inc.' })
  @IsString()
  @Length(1, 100)
  organizer: string;

  @ApiProperty({ description: 'Event cost', example: 1200.0, minimum: 0, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiProperty({ description: 'Event revenue', example: 2500.0, minimum: 0, required: false })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  revenue?: number;

  @ApiProperty({ description: 'Event creation timestamp', example: '2024-01-15T10:30:00.000Z' })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ description: 'Event last update timestamp', example: '2024-01-15T14:20:00.000Z' })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
