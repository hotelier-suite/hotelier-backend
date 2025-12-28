import { ApiProperty } from '@nestjs/swagger';
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
import { BeverageStatus } from '..';

export class BeverageInventoryDto {
  @ApiProperty({
    description: 'Unique identifier for the beverage item',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Unique item code for the beverage',
    example: 'BEV001',
  })
  @IsString()
  @Length(1, 20)
  itemCode: string;

  @ApiProperty({
    description: 'Name of the beverage',
    example: 'Premium Red Wine',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Category of the beverage',
    example: 'Wine',
  })
  @IsString()
  @Length(1, 50)
  category: string;

  @ApiProperty({
    description: 'Current stock quantity',
    example: 24,
  })
  @IsInt()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Minimum stock level before reorder',
    example: 6,
  })
  @IsInt()
  @Min(0)
  minimumStock: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'bottles',
  })
  @IsString()
  @Length(1, 20)
  unit: string;

  @ApiProperty({
    description: 'Cost per unit',
    example: 25.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  unitCost: number;

  @ApiProperty({
    description: 'Supplier name',
    example: 'Wine Distributors Ltd',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  supplier?: string;

  @ApiProperty({
    description: 'Date of last purchase',
    example: '2024-01-15T10:30:00Z',
    required: false,
    format: 'date',
  })
  @IsOptional()
  @IsDate()
  lastPurchase?: Date;

  @ApiProperty({
    description: 'Current status of the beverage item',
    enum: BeverageStatus,
    example: BeverageStatus.AVAILABLE,
  })
  @IsEnum(BeverageStatus)
  status: BeverageStatus;

  @ApiProperty({
    description: 'Creation timestamp',
    format: 'date-time',
  })
  @IsDate()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    format: 'date-time',
  })
  @IsDate()
  updatedAt: Date;
}
