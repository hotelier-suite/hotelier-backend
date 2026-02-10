import { IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindPaymentsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter payments by invoice ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  invoiceId?: number;
}
