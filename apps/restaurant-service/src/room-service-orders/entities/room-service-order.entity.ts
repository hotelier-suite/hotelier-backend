import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm';
import type { InsertEvent } from 'typeorm';
import { DecimalTransformer } from '@app/contracts/common';
import {
  RoomServiceStatus,
  RoomServiceOrderItemDto,
} from '@app/contracts/restaurant-service';

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
  items: RoomServiceOrderItemDto[];

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  total: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  orderDate: Date;

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

  @BeforeInsert()
  async generateOrderNumber(
    event: InsertEvent<RoomServiceOrder>,
  ): Promise<void> {
    if (!this.orderNumber) {
      const count = await event.manager.count(RoomServiceOrder);
      this.orderNumber = `RS${String(count + 1).padStart(3, '0')}`;
    }
  }
}
