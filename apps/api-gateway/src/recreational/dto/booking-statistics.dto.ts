import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FacilityUsageStats } from './facility-usage-stats.dto';
import { PeriodDto } from './period.dto';

export class BookingStatisticsDto {
  @ApiProperty({
    description: 'Total number of bookings',
    example: 156,
  })
  @IsNumber()
  totalBookings: number;

  @ApiProperty({
    description: 'Total revenue from recreational bookings',
    example: 3900.0,
  })
  @IsNumber()
  totalRevenue: number;

  @ApiProperty({
    description: 'Average booking value',
    example: 25.0,
  })
  @IsNumber()
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
  @IsString()
  peakHour: string;

  @ApiProperty({
    description: 'Usage statistics per facility',
    type: [FacilityUsageStats],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FacilityUsageStats)
  facilitiesUsage: FacilityUsageStats[];

  @ApiProperty({
    description: 'Booking status breakdown',
    example: { confirmed: 120, completed: 30, cancelled: 6 },
  })
  statusBreakdown: Record<string, number>;

  @ApiProperty({
    description: 'Statistics period',
    type: PeriodDto,
  })
  @IsObject()
  @ValidateNested()
  @Type(() => PeriodDto)
  period: PeriodDto;
}
