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
  Max,
  Min,
} from 'class-validator';
import { BookingPriority } from '../enums';

export class CreateRecreationalBookingDto {
  @ApiProperty({
    description: 'Guest name making the booking',
    example: 'Sarah Johnson',
  })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
  guestName: string;

  @ApiProperty({
    description: 'Guest email address',
    example: 'sarah.johnson@email.com',
  })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
  guestEmail: string;

  @ApiProperty({
    description: 'Guest phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  guestPhone?: string;

  @ApiProperty({
    description: 'Room number of the guest',
    example: '305',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  roomNumber?: string;

  @ApiProperty({
    description: 'Booking date',
    example: '2024-12-15',
    format: 'date',
  })
  @Type(() => Date)
  @IsDate()
  bookingDate: Date;

  @ApiProperty({
    description: 'Booking start time',
    example: '14:00',
    format: 'time',
  })
  @IsMilitaryTime()
  startTime: string;

  @ApiProperty({
    description: 'Booking end time',
    example: '16:00',
    format: 'time',
  })
  @IsMilitaryTime()
  endTime: string;

  @ApiProperty({
    description: 'Duration of booking in hours',
    example: 2,
    minimum: 1,
    maximum: 24,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(24)
  duration: number;

  @ApiProperty({
    description: 'Number of participants',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  participants: number;

  @ApiProperty({
    description: 'Booking priority level',
    enum: BookingPriority,
    example: BookingPriority.NORMAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingPriority)
  priority?: BookingPriority;

  @ApiProperty({
    description: 'Special requests or notes',
    example: 'Need pool towels for 3 guests',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  specialRequests?: string;

  @ApiProperty({
    description: 'Staff notes about the booking',
    example: 'VIP guest - provide premium service',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  staffNotes?: string;

  @ApiProperty({
    description: 'Discount percentage applied',
    example: 15,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @ApiProperty({
    description: 'Discount amount applied',
    example: 7.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount?: number;

  @ApiProperty({
    description: 'User ID who created the booking',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  createdByUserId?: number;

  @ApiProperty({
    description: 'Facility ID for this booking',
    example: 1,
  })
  @IsInt()
  @Min(1)
  facilityId: number;
}
