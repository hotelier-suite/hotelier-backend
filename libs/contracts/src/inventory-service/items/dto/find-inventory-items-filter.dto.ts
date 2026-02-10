import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { InventoryCategory, InventoryStatus } from '../enums';

export class FindInventoryItemsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter inventory items by category',
    enum: InventoryCategory,
    example: InventoryCategory.LINENS,
  })
  @IsOptional()
  @IsEnum(InventoryCategory)
  category?: InventoryCategory;

  @ApiPropertyOptional({
    description: 'Filter inventory items by status',
    enum: InventoryStatus,
    example: InventoryStatus.AVAILABLE,
  })
  @IsOptional()
  @IsEnum(InventoryStatus)
  status?: InventoryStatus;
}
