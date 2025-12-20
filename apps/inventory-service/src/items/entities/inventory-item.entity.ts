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
import { InventoryCategory } from '@app/contracts/inventory-service/items/enums/inventory-category.enum';
import { InventoryStatus } from '@app/contracts/inventory-service/items/enums/inventory-status.enum';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { InventoryMovement } from '../../movements/entities/inventory-movement.entity';

@Entity('inventory')
export class InventoryItem {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Bed Sheets - White Cotton' })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({ enum: InventoryCategory, example: InventoryCategory.LINENS })
  @IsEnum(InventoryCategory)
  @Column({
    type: 'enum',
    enum: InventoryCategory,
  })
  category: InventoryCategory;

  @ApiProperty({ example: 100, minimum: 0 })
  @IsNumber()
  @Min(0)
  @Column()
  currentStock: number;

  @ApiProperty({ example: 20, minimum: 0 })
  @IsNumber()
  @Min(0)
  @Column()
  minimumStock: number;

  @ApiProperty({ example: 200, minimum: 1 })
  @IsNumber()
  @Min(1)
  @Column()
  maximumStock: number;

  @ApiProperty({ example: 'pieces' })
  @IsString()
  @Length(1, 20)
  @Column()
  unit: string;

  @ApiProperty({ example: 25.5, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number.parseFloat(value),
    },
  })
  unitCost: number;

  @ApiProperty({ example: 'Linen Supply Co' })
  @IsString()
  @Length(1, 100)
  @Column()
  supplier: string;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  supplierId?: number;

  @ApiProperty({ example: 'Storage Room A' })
  @IsString()
  @Length(1, 100)
  @Column()
  location: string;

  @ApiProperty({ required: false, type: String, example: '2024-01-15' })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'date', nullable: true })
  lastPurchaseDate?: Date;

  @ApiProperty({ enum: InventoryStatus, example: InventoryStatus.AVAILABLE })
  @IsOptional()
  @IsEnum(InventoryStatus)
  @Column({
    type: 'enum',
    enum: InventoryStatus,
    default: InventoryStatus.AVAILABLE,
  })
  status: InventoryStatus;

  @ApiProperty({ type: String })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: String })
  @UpdateDateColumn()
  updatedAt: Date;

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
