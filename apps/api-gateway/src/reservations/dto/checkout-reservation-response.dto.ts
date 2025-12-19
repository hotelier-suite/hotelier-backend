import { ApiProperty } from '@nestjs/swagger';
import { Reservation } from '../entities/reservation.entity';

export class CheckoutReservationResponseDto {
  @ApiProperty({
    type: () => Reservation,
    description: 'Updated reservation after checkout',
  })
  reservation!: Reservation;

  @ApiProperty({
    type: Number,
    required: false,
    nullable: true,
    description: 'ID of the created cleaning assignment (if any)',
  })
  assignmentId?: number | null;

  @ApiProperty({
    type: Number,
    required: false,
    nullable: true,
    description: 'ID of the generated invoice (if any)',
  })
  invoiceId?: number | null;
}
