import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsMilitaryTime,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { EventStatus } from '../../events/enums';

export class CreateEventBookingDto {
  @ApiProperty({
    description: 'Event booking title',
    example: 'Smith Family Reunion',
  })
  @IsString()
  @Length(1, 200)
  @Transform(({ value }: { value: string }) => value?.trim())
  title: string;

  @ApiProperty({
    description: 'Event booking description',
    example: 'Annual family gathering with lunch, activities, and celebration.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Transform(({ value }: { value: string }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: 'Event date',
    example: '2024-12-14',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  eventDate: Date;

  @ApiProperty({
    description: 'Event start time',
    example: '11:00',
    format: 'time',
  })
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({
    description: 'Event end time',
    example: '16:00',
    format: 'time',
  })
  @IsMilitaryTime()
  endTime: string;

  @ApiProperty({ description: 'Number of attendees', example: 80, minimum: 1 })
  @IsInt()
  @Min(1)
  attendees: number;

  @ApiProperty({
    description: 'Total cost of the event',
    example: 2400.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalCost?: number;

  @ApiProperty({
    description: 'Event booking status',
    enum: EventStatus,
    example: EventStatus.PLANNED,
    required: false,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiProperty({ description: 'Client name', example: 'James Smith' })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
  clientName: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'carlos.martinez@email.com',
  })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  clientEmail: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  clientPhone?: string;

  @ApiProperty({
    description: 'Additional notes for the event',
    example: 'Family has dietary restrictions - vegetarian options required',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;

  @ApiProperty({
    description: 'Venue ID for the event',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  venueId: number;

  @ApiProperty({
    description: 'Guest ID associated with the event (optional)',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestId?: number;
}
