import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
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
import type { GuestDto } from '../../guests/dto/guest.dto';
import type { RoomDto } from '../../rooms/dto/room.dto';
import { BookingChannel } from '../enums/booking-channel.enum';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class ReservationDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @Length(1, 100)
  guestName: string;

  @ApiProperty({ example: 'john.smith@example.com' })
  @IsEmail()
  guestEmail: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  guestPhone?: string;

  @ApiProperty({ type: String, example: '2024-01-15T15:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  checkInDate: Date;

  @ApiProperty({ type: String, example: '2024-01-18T11:00:00.000Z' })
  @IsDate()
  @Type(() => Date)
  checkOutDate: Date;

  @ApiProperty({ example: 3, minimum: 1 })
  @IsInt()
  @Min(1)
  nights: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  guests: number;

  @ApiProperty({ example: 225.5, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  totalAmount: number;

  @ApiProperty({ required: false, example: 10, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  discountPercent?: number | null;

  @ApiProperty({ required: false, example: 20.0, minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount?: number | null;

  @ApiProperty({
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
  })
  @IsEnum(ReservationStatus)
  status: ReservationStatus;

  @ApiProperty({ enum: BookingChannel, example: BookingChannel.DIRECT })
  @IsEnum(BookingChannel)
  channel: BookingChannel;

  @ApiProperty({ required: false, example: 'Anniversary celebration' })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiProperty({ example: 101 })
  @IsInt()
  @Min(1)
  roomId: number;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  room?: RoomDto;

  @ApiProperty({ required: false })
  @IsOptional()
  guest?: GuestDto;
}
