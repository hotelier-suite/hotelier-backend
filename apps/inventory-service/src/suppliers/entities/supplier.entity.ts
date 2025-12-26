import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsNumber,
  Min,
  Max,
  Length,
} from 'class-validator';
import { InventoryItem } from '../../items';

@Entity('suppliers')
export class Supplier {
  @ApiProperty({
    description: 'Unique identifier for the supplier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Supplier name', example: 'Linen Suppliers Inc' })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Contact person name',
    example: 'Maria Gonzalez',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  contact: string;

  @ApiProperty({
    description: 'Email address',
    example: 'contact@linensuppliers.com',
  })
  @IsEmail()
  @Column()
  email: string;

  @ApiProperty({ description: 'Phone number', example: '+34 912 345 678' })
  @IsString()
  @Length(1, 20)
  @Column()
  phone: string;

  @ApiProperty({
    description: 'Business address',
    example: '123 Main Street, City, Country',
  })
  @IsString()
  @Length(1, 200)
  @Column()
  address: string;

  @ApiProperty({
    description: 'Supplier category',
    example: 'General',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Column({ nullable: true })
  category?: string;

  @ApiProperty({
    description: 'Supplier rating (0-5)',
    example: 4.0,
    minimum: 0,
    maximum: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(5)
  @Column('decimal', {
    precision: 2,
    scale: 1,
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number.parseFloat(value),
    },
  })
  rating?: number;

  @ApiProperty({
    description: 'Delivery time',
    example: '3-5 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Column({ nullable: true })
  deliveryTime?: string;

  @ApiProperty({
    description: 'Payment terms',
    example: '30 days',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Column({ nullable: true })
  paymentTerms?: string;

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

  @OneToMany(() => InventoryItem, (inventory) => inventory.supplierEntity, {
    cascade: true,
  })
  inventoryItems: InventoryItem[];
}
