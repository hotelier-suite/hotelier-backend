import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
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
import { BookingChannel } from '../enums/booking-channel.enum';

export class CreateReservationDto {
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

  @ApiProperty({ example: '2025-09-20' })
  @IsDateString()
  checkInDate: string;

  @ApiProperty({ example: '2025-09-23' })
  @IsDateString()
  checkOutDate: string;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  guests: number;

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
    required: false,
    enum: BookingChannel,
    example: BookingChannel.DIRECT,
  })
  @IsOptional()
  @IsEnum(BookingChannel)
  channel?: BookingChannel;

  @ApiProperty({ required: false, example: 'Anniversary celebration' })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  notes?: string;

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
}
