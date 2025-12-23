import { PartialType } from '@nestjs/swagger';
import { CreateEventBookingDto } from './create-event-booking.dto';

export class UpdateEventBookingDto extends PartialType(CreateEventBookingDto) {}
