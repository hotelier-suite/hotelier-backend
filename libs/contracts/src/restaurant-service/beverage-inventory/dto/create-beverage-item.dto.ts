import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateBeverageItemDto {
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
}
