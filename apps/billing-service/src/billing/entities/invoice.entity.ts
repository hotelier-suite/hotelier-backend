import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InvoiceStatus } from '@app/contracts/billing-service/invoices/enums/invoice-status.enum';
import { PaymentMethod } from '@app/contracts/billing-service/payments/enums/payment-method.enum';
import { InvoiceItem } from './invoice-item.entity';
import { Payment } from './payment.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  number: string;

  @Column()
  guestName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  issueDate: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number;

  @Column('decimal', { precision: 10, scale: 2 })
  taxes: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column({ length: 10, default: 'COP' })
  currency: string;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    nullable: true,
  })
  paymentMethod: PaymentMethod;

  @Column()
  reservationId: number;

  @Column({ nullable: true })
  userId: number;

  @OneToMany(() => InvoiceItem, (item) => item.invoice, { cascade: true })
  invoiceItems: InvoiceItem[];

  @OneToMany(() => Payment, (payment) => payment.invoice, { cascade: true })
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
