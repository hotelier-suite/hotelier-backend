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
  IsOptional,
  IsNumber,
  IsDate,
  IsInt,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { InvoiceItem } from './invoice-item.entity';
import { Payment } from './payment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('invoices')
export class Invoice {
  @ApiProperty({
    description: 'Invoice unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique invoice number',
    example: 'INV-2024-0001',
  })
  @IsString()
  @Length(1, 50)
  @Column({ unique: true })
  number: string;

  @ApiProperty({
    description: 'Guest or customer name',
    example: 'John Smith',
  })
  @IsString()
  @Length(1, 200)
  @Column()
  guestName: string;

  @ApiProperty({
    description: 'Invoice issue date',
    example: '2024-01-15T10:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  issueDate?: Date;

  @ApiProperty({
    description: 'Invoice due date',
    example: '2024-02-15T23:59:59.999Z',
  })
  @Type(() => Date)
  @IsDate()
  @Column({ type: 'timestamp' })
  dueDate: Date;

  @ApiProperty({
    description: 'Subtotal amount before taxes',
    example: 250.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @ApiProperty({
    description: 'Tax amount',
    example: 25.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  taxes: number;

  @ApiProperty({
    description: 'Total amount including taxes',
    example: 275.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @ApiProperty({
    description: 'Currency code (ISO 4217)',
    example: 'COP',
  })
  @IsString()
  @Length(1, 10)
  @Column({ length: 10, default: 'COP' })
  currency: string;

  @ApiProperty({
    description: 'Current invoice status',
    enum: InvoiceStatus,
    example: InvoiceStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(InvoiceStatus)
  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status?: InvoiceStatus;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod?: PaymentMethod;

  @ApiProperty({
    description: 'Invoice creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Invoice last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Associated reservation ID',
    example: 123,
  })
  @IsInt()
  @Min(1)
  @Column()
  reservationId: number;

  @ApiProperty({
    description: 'Associated reservation',
    type: () => Reservation,
  })
  @ManyToOne(() => Reservation, { eager: false })
  @JoinColumn({ name: 'reservationId' })
  reservation?: Reservation;

  @ApiProperty({
    description: 'Associated user ID',
    example: 456,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ nullable: true })
  userId?: number;

  @ApiProperty({
    description: 'Invoice line items',
    type: () => Array,
    isArray: true,
  })
  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  invoiceItems: InvoiceItem[];

  @ApiProperty({
    description: 'Invoice payments',
    type: () => Array,
    isArray: true,
  })
  @OneToMany(() => Payment, (payment) => payment.invoice, { cascade: true })
  payments: Payment[];
}
