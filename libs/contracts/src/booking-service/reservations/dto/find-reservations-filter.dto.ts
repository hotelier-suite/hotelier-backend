import { IsOptional, IsEnum, IsInt, IsBoolean, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type, Transform } from 'class-transformer';
import { ReservationStatus } from '../enums';

export class FindReservationsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter reservations by user ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  userId?: number;

  @ApiPropertyOptional({
    description: 'Filter reservations by status',
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
  })
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @ApiPropertyOptional({
    description: 'Filter to show only current (checked-in) reservations',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isCurrent?: boolean;

  @ApiPropertyOptional({
    description: 'Filter reservations from this date',
    type: Date,
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter reservations until this date',
    type: Date,
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  endDate?: Date;
}
