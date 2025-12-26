import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsArray,
  IsMilitaryTime,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export class FacilityUsageStatsDto {
  @ApiProperty({
    description: 'Facility ID',
    example: 1,
  })
  @IsNumber()
  facilityId: number;

  @ApiProperty({
    description: 'Facility name',
    example: 'Olympic Swimming Pool',
  })
  @IsString()
  facilityName: string;

  @ApiProperty({
    description: 'Facility type',
    example: 'SWIMMING_POOL',
  })
  @IsString()
  facilityType: string;

  @ApiProperty({
    description: 'Total number of bookings',
    example: 45,
  })
  @IsNumber()
  totalBookings: number;

  @ApiProperty({
    description: 'Total revenue generated',
    example: 1125.0,
  })
  @IsNumber()
  totalRevenue: number;

  @ApiProperty({
    description: 'Average booking duration in hours',
    example: 2.5,
  })
  @IsNumber()
  averageDuration: number;

  @ApiProperty({
    description: 'Utilization rate percentage',
    example: 68.5,
  })
  @IsNumber()
  utilizationRate: number;
}

export class PeriodDto {
  @ApiProperty({
    description: 'Start date of the statistics period',
    example: '2024-12-01',
  })
  @IsString()
  startDate: string;

  @ApiProperty({
    description: 'End date of the statistics period',
    example: '2024-12-31',
  })
  @IsString()
  endDate: string;
}

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
