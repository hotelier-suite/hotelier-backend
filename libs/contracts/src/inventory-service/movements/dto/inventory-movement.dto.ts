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
import type { InventoryItemDto } from '../../items/dto/inventory-item.dto';
import { MovementType } from '../enums/movement-type.enum';

export class InventoryMovementDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({ enum: MovementType, example: MovementType.IN })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({ example: 1, minimum: 1 })
  @IsNumber()
  @Min(1)
  inventoryId: number;

  @ApiProperty({ example: 50, minimum: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 50, minimum: 0 })
  @IsNumber()
  @Min(0)
  previousStock: number;

  @ApiProperty({ example: 100, minimum: 0 })
  @IsNumber()
  @Min(0)
  newStock: number;

  @ApiProperty({ example: 'Initial stock purchase' })
  @IsString()
  @Length(1, 200)
  reason: string;

  @ApiProperty({ required: false, example: 1275.0, minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number | null;

  @ApiProperty({ example: 'system' })
  @IsString()
  @Length(1, 50)
  user: string;

  @ApiProperty({ required: false, example: 'Inventory Manager' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  responsible?: string;

  @ApiProperty({ required: false, example: 'Initial inventory setup' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({ type: String })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  inventory?: InventoryItemDto;
}
