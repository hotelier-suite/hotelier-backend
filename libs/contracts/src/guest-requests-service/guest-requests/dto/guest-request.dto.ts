import { ApiProperty } from '@nestjs/swagger';
import { RequestPriority, RequestStatus, RequestType } from '..';

export class GuestRequestDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '301' })
  room: string;

  @ApiProperty({ example: 'Sarah Johnson' })
  guestName: string;

  @ApiProperty({ enum: RequestType, example: RequestType.TOWELS })
  type: RequestType;

  @ApiProperty({
    example: 'Please provide extra bath towels and pool towels for family of 4',
  })
  description: string;

  @ApiProperty({
    required: false,
    enum: RequestStatus,
    example: RequestStatus.PENDING,
  })
  status?: RequestStatus;

  @ApiProperty({
    required: false,
    enum: RequestPriority,
    example: RequestPriority.MEDIUM,
  })
  priority?: RequestPriority;

  @ApiProperty({ required: false, type: String })
  time?: Date;

  @ApiProperty({ required: false, type: String })
  completedAt?: Date;

  @ApiProperty({ required: false, example: 'Mary Williams' })
  assignedTo?: string;

  @ApiProperty({ required: false })
  notes?: string;

  @ApiProperty({ type: String })
  createdAt: Date;

  @ApiProperty({ type: String })
  updatedAt: Date;
}
