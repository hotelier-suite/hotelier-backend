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
  IsOptional,
  IsNumber,
  IsDate,
  IsInt,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';
import { Invoice } from './invoice.entity';

@Entity('payments')
export class Payment {
  @ApiProperty({
    description: 'Payment unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique payment reference',
    example: 'PAY-2024-0001',
  })
  @IsString()
  @Length(1, 100)
  @Column({ unique: true })
  reference: string;

  @ApiProperty({
    description: 'Payment amount',
    example: 275.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({
    description: 'Payment method used',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT_CARD,
  })
  @IsEnum(PaymentMethod)
  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @ApiProperty({
    description: 'Current payment status',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.COMPLETED,
  })
  status?: PaymentStatus;

  @ApiProperty({
    description: 'Additional payment notes',
    example: 'Payment processed successfully via credit card',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Payment processing timestamp',
    example: '2024-01-15T15:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  processedAt?: Date;

  @ApiProperty({
    description: 'Payment record creation timestamp',
    example: '2024-01-15T15:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Payment record last update timestamp',
    example: '2024-01-15T15:35:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

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
  @ManyToOne(() => Invoice, (invoice) => invoice.payments)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}
