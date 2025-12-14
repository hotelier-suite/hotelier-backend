import { OmitType } from '@nestjs/swagger';
import { IsDateString } from 'class-validator';
import { Reservation } from '../entities/reservation.entity';

export class CreateReservationDto extends OmitType(Reservation, [
  'id',
  'nights',
  'checkInDate',
  'checkOutDate',
  'createdAt',
  'updatedAt',
  'room',
  'guest',
  'totalAmount',
  'status',
]) {
  @IsDateString()
  checkInDate: string;

  @IsDateString()
  checkOutDate: string;
}
