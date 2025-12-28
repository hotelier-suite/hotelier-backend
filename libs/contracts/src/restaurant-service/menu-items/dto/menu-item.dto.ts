import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class MenuItemDto {
  @ApiProperty({
    description: 'Unique identifier for the menu item',
    example: 1,
  })
  @IsInt()
  @Min(1)
  id: number;

  @ApiProperty({
    description: 'Unique item code for the menu item',
    example: 'MAIN001',
  })
  @IsString()
  @Length(1, 20)
  itemCode: string;

  @ApiProperty({
    description: 'Category of the menu item',
    example: 'Main Courses',
  })
  @IsString()
  @Length(1, 50)
  category: string;

  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Grilled Salmon',
  })
  @IsString()
  @Length(1, 100)
  name: string;

  @ApiProperty({
    description: 'Description of the menu item',
    example: 'Fresh Atlantic salmon with lemon butter sauce',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  description?: string;

  @ApiProperty({
    description: 'Price of the menu item',
    example: 28.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Whether the item is available',
    example: true,
  })
  @IsBoolean()
  available: boolean;

  @ApiProperty({
    description: 'Estimated preparation time',
    example: '20 minutes',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  preparationTime?: string;

  @ApiProperty({
    description: 'List of ingredients',
    example: ['salmon', 'lemon', 'butter', 'herbs'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  ingredients?: string[];

  @ApiProperty({
    description: 'List of allergens',
    example: ['fish', 'dairy'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergens?: string[];

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
