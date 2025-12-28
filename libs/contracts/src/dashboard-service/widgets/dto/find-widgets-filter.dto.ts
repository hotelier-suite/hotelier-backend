import { IsOptional, IsNumber } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindWidgetsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter widgets by user ID',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  userId?: number;
}
