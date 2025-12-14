import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class FacilityUsageStats {
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
