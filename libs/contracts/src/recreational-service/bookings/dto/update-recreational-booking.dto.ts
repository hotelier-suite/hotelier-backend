import { PartialType } from '@nestjs/swagger';
import { CreateRecreationalBookingDto } from './create-recreational-booking.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { RecreationalBookingStatus } from '..';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateRecreationalBookingDto extends PartialType(
  CreateRecreationalBookingDto,
) {
  @ApiProperty({
    description: 'Booking status',
    enum: RecreationalBookingStatus,
    example: RecreationalBookingStatus.CONFIRMED,
    required: false,
  })
  @IsOptional()
  @IsEnum(RecreationalBookingStatus)
  status?: RecreationalBookingStatus;
}
