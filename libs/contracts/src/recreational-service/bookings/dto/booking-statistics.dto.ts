import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsString,
  IsArray,
  IsMilitaryTime,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FacilityUsageStatsDto } from './facility-usage-stats.dto';
import { PeriodDto } from './period.dto';
import { BookingStatusBreakdownDto } from './booking-status-breakdown.dto';

export class BookingStatisticsDto {
  @ApiProperty({
    description: 'Total number of bookings',
    example: 156,
  })
  @IsInt()
  @Min(0)
  totalBookings: number;

  @ApiProperty({
    description: 'Total revenue from recreational bookings',
    example: 3900.0,
  })
  @IsNumber()
  @Min(0)
  totalRevenue: number;

  @ApiProperty({
    description: 'Average booking value',
    example: 25.0,
  })
  @IsNumber()
  @Min(0)
  averageBookingValue: number;

  @ApiProperty({
    description: 'Most popular facility type',
    example: 'SWIMMING_POOL',
  })
  @IsString()
  mostPopularFacilityType: string;

  @ApiProperty({
    description: 'Peak booking hour',
    example: '14:00',
  })
  @IsMilitaryTime()
  peakHour: string;

  @ApiProperty({
    description: 'Usage statistics per facility',
    type: [FacilityUsageStatsDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacilityUsageStatsDto)
  facilitiesUsage: FacilityUsageStatsDto[];

  @ApiProperty({
    description: 'Booking status breakdown',
    type: BookingStatusBreakdownDto,
  })
  @ValidateNested()
  @Type(() => BookingStatusBreakdownDto)
  statusBreakdown: BookingStatusBreakdownDto;

  @ApiProperty({
    description: 'Statistics period',
    type: PeriodDto,
  })
  @ValidateNested()
  @Type(() => PeriodDto)
  period: PeriodDto;
}
