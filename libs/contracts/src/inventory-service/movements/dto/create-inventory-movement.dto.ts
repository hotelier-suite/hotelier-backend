import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { MovementType } from '../enums';

export class CreateInventoryMovementDto {
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
    description: 'Quantity of items to move',
    example: 50,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  quantity: number;

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
    example: 25.5,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiProperty({
    description: 'Username of the user recording the movement',
    example: 'inventory_manager',
  })
  @IsString()
  @Length(1, 50)
  user: string;

  @ApiProperty({
    description: 'Name of the person responsible for the movement',
    required: false,
    example: 'John Smith',
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  responsible?: string;

  @ApiProperty({
    description: 'Additional notes about the movement',
    required: false,
    example: 'Weekly order #WK2024-01',
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
