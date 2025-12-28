import { IsOptional, IsInt } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindPaymentsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter payments by invoice ID',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  invoiceId?: number;
}
