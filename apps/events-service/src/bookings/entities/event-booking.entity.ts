import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DecimalTransformer } from '@app/contracts/common';
import { EventStatus } from '@app/contracts/events-service';
import { Venue } from '../../venues';

@Entity('event_bookings')
export class EventBooking {
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

  @Column()
  endTime: string;

  @Column()
  attendees: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  totalCost: number;

  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PLANNED,
  })
  status?: EventStatus;

  @Column()
  clientName: string;

  @Column()
  clientEmail: string;

  @Column({ nullable: true })
  clientPhone?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  venueId: number;

  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @Column({ nullable: true })
  guestId?: number;
}
