import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequestPriority, GuestRequestStatus, GuestRequestType } from '..';

export class GuestRequestDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ example: '301' })
  @IsString()
  room: string;

  @ApiProperty({ example: 'Sarah Johnson' })
  @IsString()
  guestName: string;

  @ApiProperty({ enum: GuestRequestType, example: GuestRequestType.TOWELS })
  @IsEnum(GuestRequestType)
  type: GuestRequestType;

  @ApiProperty({
    example: 'Please provide extra bath towels and pool towels for family of 4',
  })
  @IsString()
  description: string;

  @ApiProperty({
    required: false,
    enum: GuestRequestStatus,
    example: GuestRequestStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(GuestRequestStatus)
  status?: GuestRequestStatus;

  @ApiProperty({
    required: false,
    enum: RequestPriority,
    example: RequestPriority.MEDIUM,
  })
  @IsOptional()
  @IsEnum(RequestPriority)
  priority?: RequestPriority;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  time?: Date;

  @ApiProperty({ required: false, type: String, format: 'date-time' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  completedAt?: Date;

  @ApiProperty({ required: false, example: 'Mary Williams' })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String, format: 'date-time' })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;
}
