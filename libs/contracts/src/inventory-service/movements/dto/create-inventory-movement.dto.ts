import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { MovementType } from '..';

export class CreateInventoryMovementDto {
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

  @ApiProperty({ example: 'Initial stock purchase' })
  @IsString()
  @Length(1, 200)
  reason: string;

  @ApiProperty({ required: false, example: 25.5, minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  cost?: number;

  @ApiProperty({ example: 'inventory_manager' })
  @IsString()
  @Length(1, 50)
  user: string;

  @ApiProperty({ required: false, example: 'John Smith' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  responsible?: string;

  @ApiProperty({ required: false, example: 'Weekly order #WK2024-01' })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  notes?: string;
}
