import { OmitType } from '@nestjs/swagger';
import { EventBooking } from '../entities/event-booking.entity';

export class CreateEventBookingDto extends OmitType(EventBooking, [
  'id',
  'createdAt',
  'updatedAt',
  'venue',
]) {}
