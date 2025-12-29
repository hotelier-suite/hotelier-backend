import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  Min,
  Length,
} from 'class-validator';
import { MovementType } from '@app/contracts/inventory-service';
import { DecimalTransformer } from '@app/contracts/common';
import { InventoryItem } from '../../items';

@Entity('inventory_movements')
export class InventoryMovement {
  @ApiProperty({
    description: 'Unique identifier for the inventory movement',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Type of inventory movement',
    enum: MovementType,
    example: MovementType.IN,
  })
  @IsEnum(MovementType)
  @Column({
    type: 'enum',
    enum: MovementType,
  })
  type: MovementType;

  @ApiProperty({
    description: 'ID of the inventory item',
    example: 1,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Column()
  inventoryId: number;

  @ApiProperty({
    description: 'Quantity moved',
    example: 50,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Column()
  quantity: number;

  @ApiProperty({
    description: 'Stock level before the movement',
    example: 50,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Column()
  previousStock: number;

  @ApiProperty({
    description: 'Stock level after the movement',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Column()
  newStock: number;

  @ApiProperty({
    description: 'Reason for the movement',
    example: 'Initial stock purchase',
  })
  @IsString()
  @Length(1, 200)
  @Column()
  reason: string;

  @ApiProperty({
    description: 'Cost associated with the movement',
    example: 1275.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  cost?: number | null;

  @ApiProperty({
    description: 'User who initiated the movement',
    example: 'inventory_manager',
  })
  @IsString()
  @Length(1, 50)
  @Column()
  user: string;

  @ApiProperty({
    description: 'Person responsible for the movement',
    example: 'John Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  responsible?: string;

  @ApiProperty({
    description: 'Additional notes about the movement',
    example: 'Weekly supply order #WK2024-01',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Date when the record was created',
    example: '2024-01-15T08:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the record was last updated',
    example: '2024-01-15T08:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('InventoryItem', 'movements', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'inventoryId' })
  inventory: InventoryItem;
}
