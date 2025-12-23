import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class MonthlyReportResponseDto {
  @ApiProperty({ description: 'Total number of invoices', example: 50 })
  @IsNumber()
  @Min(0)
  totalInvoices: number;

  @ApiProperty({ description: 'Total revenue amount', example: 15000.0 })
  @IsNumber()
  @Min(0)
  totalRevenue: number;

  @ApiProperty({ description: 'Number of paid invoices', example: 40 })
  @IsNumber()
  @Min(0)
  paidInvoices: number;

  @ApiProperty({ description: 'Number of pending invoices', example: 8 })
  @IsNumber()
  @Min(0)
  pendingInvoices: number;

  @ApiProperty({ description: 'Number of overdue invoices', example: 2 })
  @IsNumber()
  @Min(0)
  overdueInvoices: number;
}
