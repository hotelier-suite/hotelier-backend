import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class MonthlyRevenueDto {
  @ApiProperty({ description: 'Month name', example: 'Jan' })
  @IsString()
  month: string;

  @ApiProperty({ description: 'Revenue for the month', example: 25000.0 })
  @IsNumber()
  @Min(0)
  revenue: number;

  @ApiProperty({ description: 'Expenses for the month', example: 10000.0 })
  @IsNumber()
  @Min(0)
  expenses: number;

  @ApiProperty({ description: 'Profit for the month', example: 15000.0 })
  @IsNumber()
  profit: number;
}
