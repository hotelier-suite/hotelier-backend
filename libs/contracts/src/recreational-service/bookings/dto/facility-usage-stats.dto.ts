import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, IsString, Min, Max } from 'class-validator';

export class FacilityUsageStatsDto {
  @ApiProperty({
    description: 'Facility ID',
    example: 1,
  })
  @IsInt()
  @Min(1)
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
  @IsInt()
  @Min(0)
  totalBookings: number;

  @ApiProperty({
    description: 'Total revenue generated',
    example: 1125.0,
  })
  @IsNumber()
  @Min(0)
  totalRevenue: number;

  @ApiProperty({
    description: 'Average booking duration in hours',
    example: 2.5,
  })
  @IsNumber()
  @Min(0)
  averageDuration: number;

  @ApiProperty({
    description: 'Utilization rate percentage',
    example: 68.5,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  utilizationRate: number;
}
