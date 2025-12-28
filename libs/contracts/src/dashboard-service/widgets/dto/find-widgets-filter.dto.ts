import { IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class FindWidgetsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter widgets by user ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;
}
