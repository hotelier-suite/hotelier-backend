import { IsOptional, IsBoolean, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class FindBeverageInventoryFilterDto {
  @ApiPropertyOptional({
    description:
      'Filter by low stock status (items with stock <= minimumStock)',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  lowStock?: boolean;

  @ApiPropertyOptional({
    description: 'Filter by beverage category',
    example: 'Wine',
  })
  @IsOptional()
  @IsString()
  category?: string;
}
