import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { InventoryCategory } from '../enums/inventory-category.enum';

export class CreateInventoryItemDto {
  @ApiProperty({ example: 'Bed Sheets - White Cotton' })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({ enum: InventoryCategory, example: InventoryCategory.LINENS })
  @IsEnum(InventoryCategory)
  category: InventoryCategory;

  @ApiProperty({ example: 100, minimum: 0 })
  @IsNumber()
  @Min(0)
  currentStock: number;

  @ApiProperty({ example: 20, minimum: 0 })
  @IsNumber()
  @Min(0)
  minimumStock: number;

  @ApiProperty({ example: 200, minimum: 1 })
  @IsNumber()
  @Min(1)
  maximumStock: number;

  @ApiProperty({ example: 'pieces' })
  @IsString()
  @Length(1, 20)
  unit: string;

  @ApiProperty({ example: 25.5, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitCost: number;

  @ApiProperty({ example: 'Linen Supply Co' })
  @IsString()
  @Length(1, 100)
  supplier: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  supplierId?: number;

  @ApiProperty({ example: 'Storage Room A' })
  @IsString()
  @Length(1, 100)
  location: string;

  @ApiProperty({ required: false, type: String, example: '2024-01-15' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  lastPurchaseDate?: Date;
}
