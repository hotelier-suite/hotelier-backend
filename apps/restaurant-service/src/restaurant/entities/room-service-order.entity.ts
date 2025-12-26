import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DecimalTransformer } from '../../database';
import { RoomServiceStatus } from '@app/contracts/restaurant-service';

@Entity('room_service_orders')
export class RoomServiceOrder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  orderNumber: string;

  @Column()
  room: string;

  @Column()
  guest: string;

  @Column('json')
  items: any[];

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  total: number;

  @Column()
  orderTime: string;

  @Column({ nullable: true })
  estimatedTime?: string;

  @Column({
    type: 'enum',
    enum: RoomServiceStatus,
    default: RoomServiceStatus.PENDING,
  })
  status: RoomServiceStatus;

  @Column({ nullable: true })
  waiter?: string;

  @Column({ type: 'text', nullable: true })
  specialInstructions?: string;

  @Column({ nullable: true })
  guestId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
