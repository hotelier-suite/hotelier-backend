import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class OccupancyDataDto {
  @ApiProperty({ description: 'Date', example: '2024-01-15' })
  @IsString()
  date: string;

  @ApiProperty({ description: 'Occupancy percentage', example: 85.5 })
  @IsNumber()
  @Min(0)
  occupancyPercentage: number;

  @ApiProperty({ description: 'Total revenue for the day', example: 12500.0 })
  @IsNumber()
  @Min(0)
  totalRevenue: number;
}
