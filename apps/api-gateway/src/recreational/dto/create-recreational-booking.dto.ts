import { OmitType } from '@nestjs/swagger';
import { RecreationalBooking } from '../entities/recreational-booking.entity';

export class CreateRecreationalBookingDto extends OmitType(
  RecreationalBooking,
  [
    'id',
    'totalCost',
    'status',
    'actualCheckIn',
    'actualCheckOut',
    'createdAt',
    'updatedAt',
    'facility',
  ],
) {}
