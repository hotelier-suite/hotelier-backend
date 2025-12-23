import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateMenuItemDto {
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
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  available?: boolean;

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
  ingredients?: string[];

  @ApiProperty({
    description: 'List of allergens',
    example: ['fish', 'dairy'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  allergens?: string[];
}
