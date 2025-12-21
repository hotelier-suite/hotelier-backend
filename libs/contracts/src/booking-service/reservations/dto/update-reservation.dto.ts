import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateReservationDto } from './create-reservation.dto';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;
}
