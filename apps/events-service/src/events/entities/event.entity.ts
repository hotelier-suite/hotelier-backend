import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DecimalTransformer } from '@app/contracts/common';
import { EventStatus } from '@app/contracts/events-service';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'date' })
  eventDate: Date;

  @Column()
  startTime: string;

  @Column({ nullable: true })
  endTime?: string;

  @Column()
  venue: string;

  @Column()
  capacity: number;

  @Column({ default: 0 })
  attendees?: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PLANNED,
  })
  status?: EventStatus;

  @Column()
  organizer: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  cost?: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  revenue?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
