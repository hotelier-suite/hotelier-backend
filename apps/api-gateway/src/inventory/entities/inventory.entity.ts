import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDate,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InventoryCategory } from '../enums/inventory-category.enum';
import { InventoryStatus } from '../enums/inventory-status.enum';
import { Supplier } from './supplier.entity';
import { InventoryMovement } from './inventory-movement.entity';

@Entity('inventory')
export class Inventory {
  @ApiProperty({
    description: 'Unique identifier for the inventory item',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Name of the inventory item',
    example: 'Bed Sheets - White Cotton',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Category of the inventory item',
    enum: InventoryCategory,
    example: InventoryCategory.LINENS,
  })
  @IsEnum(InventoryCategory)
  @Column({
    type: 'enum',
    enum: InventoryCategory,
  })
  category: InventoryCategory;

  @ApiProperty({
    description: 'Current stock quantity',
    example: 100,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Column()
  currentStock: number;

  @ApiProperty({
    description: 'Minimum stock threshold',
    example: 20,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Column()
  minimumStock: number;

  @ApiProperty({
    description: 'Maximum stock capacity',
    example: 200,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Column()
  maximumStock: number;

  @ApiProperty({
    description: 'Unit of measurement',
    example: 'pieces',
  })
  @IsString()
  @Length(1, 20)
  @Column()
  unit: string;

  @ApiProperty({
    description: 'Cost per unit',
    example: 25.5,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  unitCost: number;

  @ApiProperty({
    description: 'Supplier name (legacy field)',
    example: 'Linen Supply Co',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  supplier: string;

  @ApiProperty({
    description: 'Supplier ID (foreign key)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  supplierId?: number;

  @ApiProperty({
    description: 'Storage location',
    example: 'Storage Room A',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  location: string;

  @ApiProperty({
    description: 'Last purchase date',
    example: '2024-01-15',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'date', nullable: true })
  lastPurchaseDate?: Date;

  @ApiProperty({
    description: 'Current inventory status',
    enum: InventoryStatus,
    example: InventoryStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(InventoryStatus)
  @Column({
    type: 'enum',
    enum: InventoryStatus,
    default: InventoryStatus.AVAILABLE,
  })
  status: InventoryStatus;

  @ApiProperty({
    description: 'Date when the record was created',
    example: '2024-01-15T08:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the record was last updated',
    example: '2024-01-15T14:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier, (supplier) => supplier.inventoryItems, {
    nullable: true,
  })
  @JoinColumn({ name: 'supplierId' })
  supplierEntity?: Supplier;

  @OneToMany(() => InventoryMovement, (movement) => movement.inventory, {
    cascade: true,
  })
  movements: InventoryMovement[];
}
