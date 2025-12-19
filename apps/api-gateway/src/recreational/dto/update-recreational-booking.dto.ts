import { PartialType } from '@nestjs/swagger';
import { CreateRecreationalBookingDto } from './create-recreational-booking.dto';

export class UpdateRecreationalBookingDto extends PartialType(
  CreateRecreationalBookingDto,
) {}
