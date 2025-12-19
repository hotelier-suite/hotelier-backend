import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsInt, Length, Min } from 'class-validator';
import { Invoice } from './invoice.entity';

@Entity('invoice_items')
export class InvoiceItem {
  @ApiProperty({
    description: 'Invoice item unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Item description',
    example: 'Room accommodation (3 nights)',
  })
  @IsString()
  @Length(1, 500)
  @Column()
  description: string;

  @ApiProperty({
    description: 'Item quantity',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Column()
  quantity: number;

  @ApiProperty({
    description: 'Unit price',
    example: 75.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Total amount (quantity × price)',
    example: 225.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    description: 'Associated invoice ID',
    example: 123,
  })
  @IsInt()
  @Min(1)
  @Column()
  invoiceId: number;

  @ApiProperty({
    description: 'Associated invoice',
    type: () => Invoice,
  })
  @ManyToOne(() => Invoice, (invoice) => invoice.invoiceItems, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}
