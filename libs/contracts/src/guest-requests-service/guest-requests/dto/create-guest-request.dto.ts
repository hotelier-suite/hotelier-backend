import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { RequestPriority, GuestRequestStatus, GuestRequestType } from '..';

export class CreateGuestRequestDto {
  @ApiProperty({ example: '301' })
  @IsString()
  @Length(1, 20)
  room: string;

  @ApiProperty({ example: 'Sarah Johnson' })
  @IsString()
  @Length(1, 100)
  guestName: string;

  @ApiProperty({ enum: GuestRequestType, example: GuestRequestType.TOWELS })
  @IsEnum(GuestRequestType)
  type: GuestRequestType;

  @ApiProperty({
    example: 'Please provide extra bath towels and pool towels for family of 4',
  })
  @IsString()
  @Length(1, 1000)
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

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  time?: Date;

  @ApiProperty({ required: false, example: 'Mary Williams' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  assignedTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  notes?: string;
}
