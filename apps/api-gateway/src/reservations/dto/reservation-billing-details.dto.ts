import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../entities/reservation.entity';
import { RoomServiceChargeDto } from './room-service-charge.dto';
import { EventChargeDto } from './event-charge.dto';

export class ReservationBillingDetailsDto {
  @ApiProperty({ description: 'Reservation data', type: () => Reservation })
  reservation: Reservation;

  @ApiProperty({
    description: 'Total room charges',
    example: 450.0,
  })
  roomCharges: number;

  @ApiProperty({
    description: 'Room service orders',
    type: [RoomServiceChargeDto],
    isArray: true,
  })
  roomServiceCharges: RoomServiceChargeDto[];

  @ApiProperty({
    description: 'Total room service charges',
    example: 67.5,
  })
  roomServiceTotal: number;

  @ApiProperty({
    description: 'Event bookings',
    type: [EventChargeDto],
    isArray: true,
  })
  eventCharges: EventChargeDto[];

  @ApiProperty({
    description: 'Total event charges',
    example: 2400.0,
  })
  eventTotal: number;

  @ApiProperty({
    description: 'Grand total of all charges',
    example: 2917.5,
  })
  grandTotal: number;

  @ApiProperty({
    description: 'Whether this reservation already has an invoice',
    example: false,
  })
  hasInvoice: boolean;
}
