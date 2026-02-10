import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import {
  RequestPriority,
  GuestRequestStatus,
  GuestRequestType,
} from '../enums';

export class GuestRequestDto {
  @ApiProperty({
    description: 'Unique identifier for the guest request',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Room number where the guest is staying',
    example: '301',
  })
  @IsString()
  room: string;

  @ApiProperty({
    description: 'Full name of the guest making the request',
    example: 'Sarah Johnson',
  })
  @IsString()
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
    description: 'Timestamp when the request was completed',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  completedAt?: Date;

  @ApiProperty({
    description: 'Name of the staff member assigned to handle the request',
    required: false,
    example: 'Mary Williams',
  })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({
    description: 'Additional notes or comments about the request',
    required: false,
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Timestamp when the guest request was created',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the guest request was last updated',
    type: String,
    format: 'date-time',
  })
  @Type(() => Date)
  @IsDate()
  updatedAt: Date;
}
