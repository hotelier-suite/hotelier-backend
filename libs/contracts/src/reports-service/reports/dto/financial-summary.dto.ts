import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { RevenueBreakdownDto } from './revenue-breakdown.dto';

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
