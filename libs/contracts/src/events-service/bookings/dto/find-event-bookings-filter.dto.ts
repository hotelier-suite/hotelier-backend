import { IsOptional, IsInt, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EventStatus } from '../../events/enums';

export class FindEventBookingsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter to show only upcoming bookings',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isUpcoming?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by booking status',
    enum: EventStatus,
    example: EventStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ApiPropertyOptional({
    description: 'Filter by guest ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  guestId?: number;

  @ApiPropertyOptional({
    description: 'Filter by venue ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  venueId?: number;

  @ApiPropertyOptional({
    description: 'Filter bookings from this date',
    type: Date,
    example: '2024-01-01',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter bookings until this date',
    type: Date,
    example: '2024-12-31',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  endDate?: Date;
}
