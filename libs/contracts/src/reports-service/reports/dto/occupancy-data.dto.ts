import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber, Max, Min } from 'class-validator';

export class OccupancyDataDto {
  @ApiProperty({ description: 'Date', type: String, example: '2024-01-15' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ description: 'Occupancy percentage', example: 85.5 })
  @IsNumber()
  @Min(0)
  @Max(100)
  occupancyPercentage: number;

  @ApiProperty({ description: 'Total revenue for the day', example: 12500.0 })
  @IsNumber()
  @Min(0)
  totalRevenue: number;
}
