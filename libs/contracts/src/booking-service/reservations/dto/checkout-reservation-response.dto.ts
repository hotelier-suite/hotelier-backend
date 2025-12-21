import { ApiProperty } from '@nestjs/swagger';
import { ReservationDto } from './reservation.dto';

export class CheckoutReservationResponseDto {
  @ApiProperty({
    type: () => ReservationDto,
    description: 'Updated reservation after checkout',
  })
  reservation!: ReservationDto;

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
