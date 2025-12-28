import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { InventoryCategory } from '..';

export class CreateInventoryItemDto {
  @ApiProperty({
    description: 'Name of the inventory item',
    example: 'Bed Sheets - White Cotton',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Category classification of the inventory item',
    enum: InventoryCategory,
    example: InventoryCategory.LINENS,
  })
  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @ApiProperty({
    description: 'Current quantity of the item in stock',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  currentStock: number;

  @ApiProperty({
    description: 'Minimum stock level before reorder is triggered',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  minimumStock: number;

  @ApiProperty({
    description: 'Maximum stock capacity for this item',
    example: 200,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  maximumStock: number;

  @ApiProperty({
    description: 'Unit of measurement for the item',
    example: 'pieces',
  })
  @IsString()
  @Length(1, 20)
  unit: string;

  @ApiProperty({
    description: 'Cost per unit of the item',
    example: 25.5,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitCost: number;

  @ApiProperty({
    description: 'Name of the supplier providing this item',
    example: 'Linen Supply Co',
  })
  @IsString()
  @Length(1, 100)
  supplier: string;

  @ApiProperty({
    description: 'ID of the supplier associated with this item',
    required: false,
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  supplierId?: number;

  @ApiProperty({
    description: 'Storage location of the item within the facility',
    example: 'Storage Room A',
  })
  @IsString()
  @Length(1, 100)
  location: string;

  @ApiProperty({
    description: 'Date when the item was last purchased',
    required: false,
    type: String,
    format: 'date',
    example: '2024-01-15',
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  lastPurchaseDate?: Date;
}
