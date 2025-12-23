import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min } from 'class-validator';

export class FinancialSummaryResponseDto {
  @ApiProperty({ description: 'Total revenue amount', example: 15000.0 })
  @IsNumber()
  @Min(0)
  totalRevenue: number;

  @ApiProperty({ description: 'Total paid amount', example: 12000.0 })
  @IsNumber()
  @Min(0)
  paidAmount: number;

  @ApiProperty({ description: 'Total pending amount', example: 3000.0 })
  @IsNumber()
  @Min(0)
  pendingAmount: number;

  @ApiProperty({ description: 'Total overdue amount', example: 500.0 })
  @IsNumber()
  @Min(0)
  overdueAmount: number;

  @ApiProperty({ description: 'Total number of paid invoices', example: 25 })
  @IsNumber()
  @Min(0)
  totalPaidInvoices: number;

  @ApiProperty({ description: 'Total number of pending invoices', example: 8 })
  @IsNumber()
  @Min(0)
  totalPendingInvoices: number;

  @ApiProperty({ description: 'Total number of overdue invoices', example: 2 })
  @IsNumber()
  @Min(0)
  totalOverdueInvoices: number;
}
