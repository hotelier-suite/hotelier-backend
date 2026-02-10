import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DailyRevenueDto } from './daily-revenue.dto';

export class RevenueReportDataDto {
  @ApiProperty({ description: 'Total revenue', example: 25000.75 })
  @IsNumber()
  @Min(0)
  totalRevenue: number;

  @ApiProperty({ description: 'Revenue from room bookings', example: 20000.0 })
  @IsNumber()
  @Min(0)
  roomRevenue: number;

  @ApiProperty({ description: 'Revenue from services', example: 3500.5 })
  @IsNumber()
  @Min(0)
  serviceRevenue: number;

  @ApiProperty({ description: 'Other revenue sources', example: 1500.25 })
  @IsNumber()
  @Min(0)
  otherRevenue: number;

  @ApiProperty({ description: 'Average revenue per room', example: 166.67 })
  @IsNumber()
  @Min(0)
  averageRevenuePerRoom: number;

  @ApiProperty({
    description: 'Daily revenue breakdown',
    type: [DailyRevenueDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DailyRevenueDto)
  dailyBreakdown: DailyRevenueDto[];
}
