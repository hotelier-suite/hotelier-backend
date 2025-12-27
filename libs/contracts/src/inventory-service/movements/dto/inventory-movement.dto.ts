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
import type { InventoryItemDto } from '../../items';
import { MovementType } from '..';

export class InventoryMovementDto {
  @ApiProperty({
    description: 'Unique identifier for the inventory movement',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Type of inventory movement (in or out)',
    enum: MovementType,
    example: MovementType.IN,
  })
  @IsEnum(MovementType)
  type: MovementType;

  @ApiProperty({
    description: 'ID of the inventory item associated with this movement',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  inventoryId: number;

  @ApiProperty({
    description: 'Quantity of items moved',
    example: 50,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    description: 'Stock level before the movement',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  previousStock: number;

  @ApiProperty({
    description: 'Stock level after the movement',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  newStock: number;

  @ApiProperty({
    description: 'Reason for the inventory movement',
    example: 'Initial stock purchase',
  })
  @IsString()
  @Length(1, 200)
  reason: string;

  @ApiProperty({
    description: 'Total cost of the movement transaction',
    required: false,
    example: 1275.0,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number | null;

  @ApiProperty({
    description: 'Username of the user who recorded the movement',
    example: 'system',
  })
  @IsString()
  @Length(1, 50)
  user: string;

  @ApiProperty({
    description: 'Name of the person responsible for the movement',
    required: false,
    example: 'Inventory Manager',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  responsible?: string;

  @ApiProperty({
    description: 'Additional notes about the movement',
    required: false,
    example: 'Initial inventory setup',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;

  @ApiProperty({
    description: 'Timestamp when the movement was recorded',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamp when the movement record was last updated',
    type: String,
    format: 'date-time',
  })
  @IsDate()
  @Type(() => Date)
  updatedAt: Date;

  @ApiProperty({
    description: 'Related inventory item details',
    required: false,
  })
  @IsOptional()
  inventory?: InventoryItemDto;
}
