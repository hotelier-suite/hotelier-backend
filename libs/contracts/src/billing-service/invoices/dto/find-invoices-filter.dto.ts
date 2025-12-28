import { IsOptional, IsEnum, IsInt, IsDate } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InvoiceStatus } from '../enums';

export class FindInvoicesFilterDto {
  @ApiPropertyOptional({
    description: 'Filter invoices by status',
    enum: InvoiceStatus,
    example: InvoiceStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  status?: InvoiceStatus;

  @ApiPropertyOptional({
    description: 'Filter invoices from this date (inclusive)',
    example: '2024-01-01T00:00:00.000Z',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter invoices until this date (inclusive)',
    example: '2024-12-31T23:59:59.999Z',
    type: Date,
  })
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiPropertyOptional({
    description: 'Filter invoices by user ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  userId?: number;
}
