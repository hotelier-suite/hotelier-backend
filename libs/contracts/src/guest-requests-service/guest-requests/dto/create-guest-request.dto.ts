import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import {
  RequestPriority,
  GuestRequestStatus,
  GuestRequestType,
} from '../enums';

export class CreateGuestRequestDto {
  @ApiProperty({
    description: 'Room number where the guest is staying',
    example: '301',
  })
  @IsString()
  @Length(1, 20)
  room: string;

  @ApiProperty({
    description: 'Full name of the guest making the request',
    example: 'Sarah Johnson',
  })
  @IsString()
  @Length(1, 100)
  guestName: string;

  @ApiProperty({
    description: 'Category of the guest request',
    enum: GuestRequestType,
    example: GuestRequestType.TOWELS,
  })
  @IsEnum(GuestRequestType)
  type: GuestRequestType;

  @ApiProperty({
    description: 'Detailed description of the guest request',
    example: 'Please provide extra bath towels and pool towels for family of 4',
  })
  @IsString()
  @Length(1, 1000)
  description: string;

  @ApiProperty({
    description: 'Current status of the guest request',
    required: false,
    enum: GuestRequestStatus,
    example: GuestRequestStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(GuestRequestStatus)
  status?: GuestRequestStatus;

  @ApiProperty({
    description: 'Priority level of the guest request',
    required: false,
    enum: RequestPriority,
    example: RequestPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(RequestPriority)
  priority?: RequestPriority;

  @ApiProperty({
    description: 'Requested time for the service to be delivered',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  time?: Date;

  @ApiProperty({
    description: 'Name of the staff member assigned to handle the request',
    required: false,
    example: 'Mary Williams',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  assignedTo?: string;

  @ApiProperty({
    description: 'Additional notes or comments about the request',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
