import { ApiProperty } from '@nestjs/swagger';

export class EventChargeDto {
  @ApiProperty({ description: 'Event booking ID', example: 1 })
  bookingId: number;

  @ApiProperty({
    description: 'Event title',
    example: 'Smith Family Reunion',
  })
  title: string;

  @ApiProperty({ description: 'Event date', example: '2024-12-14' })
  eventDate: string;

  @ApiProperty({ description: 'Event total cost', example: 2400.0 })
  total: number;

  @ApiProperty({ description: 'Event status', example: 'confirmed' })
  status: string;

  @ApiProperty({ description: 'Number of attendees', example: 80 })
  attendees: number;
}
