import { IsOptional, IsInt, IsBoolean, IsEnum, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { EventStatus } from '../../events/enums';

export class FindEventBookingsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter to show only upcoming bookings',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
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
  @Type(() => Number)
  guestId?: number;

  @ApiPropertyOptional({
    description: 'Filter by venue ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  venueId?: number;

  @ApiPropertyOptional({
    description: 'Filter bookings from this date',
    type: Date,
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter bookings until this date',
    type: Date,
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
