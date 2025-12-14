import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsInt,
  IsArray,
  Min,
  Length,
} from 'class-validator';
import { DecimalTransformer } from '../../database/transformers/decimal.transformer';

@Entity('menu_items')
export class MenuItem {
  @ApiProperty({
    description: 'Unique identifier for the menu item',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique item code for the menu item',
    example: 'MAIN001',
  })
  @IsString()
  @Length(1, 20)
  @Column({ unique: true })
  itemCode: string;

  @ApiProperty({
    description: 'Category of the menu item',
    example: 'Main Courses',
  })
  @IsString()
  @Length(1, 50)
  @Column()
  category: string;

  @ApiProperty({
    description: 'Name of the menu item',
    example: 'Grilled Salmon',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Description of the menu item',
    example: 'Fresh Atlantic salmon with lemon butter sauce',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Price of the menu item',
    example: 28.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  price: number;

  @ApiProperty({
    description: 'Whether the item is available',
    example: true,
  })
  @IsBoolean()
  @Column({ default: true })
  available: boolean;

  @ApiProperty({
    description: 'Estimated preparation time',
    example: '20 minutes',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Column({ nullable: true })
  preparationTime?: string;

  @ApiProperty({
    description: 'List of ingredients as JSON',
    example: ['salmon', 'lemon', 'butter', 'herbs'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Column('json', { nullable: true })
  ingredients?: string[];

  @ApiProperty({
    description: 'List of allergens as JSON',
    example: ['fish', 'dairy'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Column('json', { nullable: true })
  allergens?: string[];

  @ApiProperty({
    description: 'Creation timestamp',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
