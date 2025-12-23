import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { EventBooking } from '../../events/entities/event-booking.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  capacity: number;

  @Column('decimal', { precision: 8, scale: 2 })
  area: number;

  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @Column({ default: true })
  available: boolean;

  @Column()
  location: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => EventBooking, (event) => event.venue, { cascade: true })
  events: EventBooking[];
}
