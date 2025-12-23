import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class RevenueBreakdownDto {
  @ApiProperty({ description: 'Revenue from rooms', example: 15000.0 })
  @IsNumber()
  @Min(0)
  room: number;

  @ApiProperty({ description: 'Revenue from restaurant', example: 5000.0 })
  @IsNumber()
  @Min(0)
  restaurant: number;

  @ApiProperty({ description: 'Revenue from services', example: 3000.0 })
  @IsNumber()
  @Min(0)
  services: number;

  @ApiProperty({ description: 'Revenue from events', example: 2000.0 })
  @IsNumber()
  @Min(0)
  events: number;

  @ApiProperty({ description: 'Total revenue', example: 25000.0 })
  @IsNumber()
  @Min(0)
  total: number;
}

export class FinancialSummaryDto {
  @ApiProperty({
    description: 'Revenue breakdown by category',
    type: RevenueBreakdownDto,
  })
  @ValidateNested()
  @Type(() => RevenueBreakdownDto)
  revenue: RevenueBreakdownDto;

  @ApiProperty({ description: 'Total expenses', example: 10000.0 })
  @IsNumber()
  @Min(0)
  expenses: number;

  @ApiProperty({ description: 'Gross profit', example: 15000.0 })
  @IsNumber()
  grossProfit: number;

  @ApiProperty({ description: 'Profit margin percentage', example: 60.0 })
  @IsNumber()
  profitMargin: number;
}
