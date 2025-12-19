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
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BeverageStatus } from '../enums/beverage-status.enum';
import { DecimalTransformer } from '../../database/transformers/decimal.transformer';

@Entity('beverage_inventory')
export class BeverageInventory {
  @ApiProperty({
    description: 'Unique identifier for the beverage item',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique item code for the beverage',
    example: 'BEV001',
  })
  @IsString()
  @Length(1, 20)
  @Column({ unique: true })
  itemCode: string;

  @ApiProperty({
    description: 'Name of the beverage',
    example: 'Premium Red Wine',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Category of the beverage',
    example: 'Wine',
  })
  @IsString()
  @Length(1, 50)
  @Column()
  category: string;

  @ApiProperty({
    description: 'Current stock quantity',
    example: 24,
  })
  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  stock: number;

  @ApiProperty({
    description: 'Minimum stock level before reorder',
    example: 6,
  })
  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  minimumStock: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'bottles',
  })
  @IsString()
  @Length(1, 20)
  @Column()
  unit: string;

  @ApiProperty({
    description: 'Cost per unit',
    example: 25.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  unitCost: number;

  @ApiProperty({
    description: 'Supplier name',
    example: 'Wine Distributors Ltd',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  supplier?: string;

  @ApiProperty({
    description: 'Date of last purchase',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  lastPurchase?: Date;

  @ApiProperty({
    description: 'Current status of the beverage item',
    enum: BeverageStatus,
    example: BeverageStatus.AVAILABLE,
  })
  @IsEnum(BeverageStatus)
  @Column({
    type: 'enum',
    enum: BeverageStatus,
    default: BeverageStatus.AVAILABLE,
  })
  status: BeverageStatus;

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
