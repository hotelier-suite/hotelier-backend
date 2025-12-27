import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
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
import { BookingChannel } from '..';

export class CreateReservationDto {
  @ApiProperty({
    description: 'Full name of the guest making the reservation',
    example: 'John Smith',
  })
  @IsString()
  @Length(1, 100)
  @Transform(({ value }: { value: string }) => value?.trim())
  guestName: string;

  @ApiProperty({
    description: 'Email address of the guest for communication',
    example: 'john.smith@example.com',
  })
  @IsEmail()
  @Transform(({ value }: { value: string }) => value?.toLowerCase().trim())
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
    description: 'Check-in date for the reservation',
    format: 'date-time',
    example: '2025-09-20',
  })
  @Type(() => Date)
  @IsDate()
  checkInDate: Date;

  @ApiProperty({
    description: 'Check-out date for the reservation',
    format: 'date-time',
    example: '2025-09-23',
  })
  @Type(() => Date)
  @IsDate()
  checkOutDate: Date;

  @ApiProperty({
    description: 'Number of guests included in the reservation',
    example: 2,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  guests: number;

  @ApiProperty({
    description: 'Discount percentage to apply to the reservation',
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
    description: 'Discount amount in USD to apply to the reservation',
    required: false,
    example: 20.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  discountAmount?: number | null;

  @ApiProperty({
    description: 'Channel through which the booking is being made',
    required: false,
    enum: BookingChannel,
    example: BookingChannel.DIRECT,
  })
  @IsOptional()
  @IsEnum(BookingChannel)
  channel?: BookingChannel;

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
    description: 'ID of the user creating the reservation',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiProperty({
    description: 'ID of the room to assign to this reservation',
    example: 101,
  })
  @IsInt()
  @Min(1)
  roomId: number;

  @ApiProperty({
    description: 'ID of an existing guest to associate with this reservation',
    required: false,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  guestId?: number;
}
