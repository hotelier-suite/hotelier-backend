import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import type { GuestDto } from '../../guests';
import type { RoomDto } from '../../rooms';
import { BookingChannel, ReservationStatus } from '..';

export class ReservationDto {
  @ApiProperty({
    description: 'Unique identifier for the reservation',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Full name of the guest making the reservation',
    example: 'John Smith',
  })
  @IsString()
  @Length(1, 100)
  guestName: string;

  @ApiProperty({
    description: 'Email address of the guest for communication',
    example: 'john.smith@example.com',
  })
  @IsEmail()
  guestEmail: string;

  @ApiProperty({
    description: 'Phone number of the guest for contact purposes',
    required: false,
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiProperty({
    description: 'Check-in date and time for the reservation',
    type: String,
    format: 'date-time',
    example: '2024-01-15T15:00:00.000Z',
  })
  @IsDate()
  checkInDate: Date;

  @ApiProperty({
    description: 'Check-out date and time for the reservation',
    type: String,
    format: 'date-time',
    example: '2024-01-18T11:00:00.000Z',
  })
  @IsDate()
  checkOutDate: Date;

  @ApiProperty({
    description: 'Number of nights for the reservation',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  nights: number;

  @ApiProperty({
    description: 'Number of guests included in the reservation',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  guests: number;

  @ApiProperty({
    description: 'Total amount for the reservation in USD',
    example: 225.5,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @ApiProperty({
    description: 'Discount percentage applied to the reservation',
    required: false,
    example: 10,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  discountPercent?: number | null;

  @ApiProperty({
    description: 'Discount amount in USD applied to the reservation',
    required: false,
    example: 20.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount?: number | null;

  @ApiProperty({
    description: 'Current status of the reservation',
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
  })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @ApiProperty({
    description: 'Channel through which the booking was made',
    enum: BookingChannel,
    example: BookingChannel.DIRECT,
  })
  @IsEnum(BookingChannel)
  channel: BookingChannel;

  @ApiProperty({
    description: 'Additional notes or special requests for the reservation',
    required: false,
    example: 'Anniversary celebration',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;

  @ApiProperty({
    description: 'Timestamp when the reservation was created',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the reservation was last updated',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the user who created the reservation',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiProperty({
    description: 'ID of the room assigned to this reservation',
    example: 101,
  })
  @IsInt()
  @Min(1)
  roomId: number;

  @ApiProperty({
    description: 'ID of the guest associated with this reservation',
    required: false,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestId?: number;

  @ApiProperty({
    description: 'Room details associated with this reservation',
    required: false,
  })
  @IsOptional()
  room?: RoomDto;

  @ApiProperty({
    description: 'Guest details associated with this reservation',
    required: false,
  })
  @IsOptional()
  guest?: GuestDto;
}
