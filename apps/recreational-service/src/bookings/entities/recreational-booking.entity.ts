import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  RecreationalBookingStatus,
  BookingPriority,
} from '@app/contracts/recreational-service';
import { RecreationalFacility } from '../../facilities/entities';

@Entity('recreational_bookings')
export class RecreationalBooking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  guestName: string;

  @Column()
  guestEmail: string;

  @Column({ nullable: true })
  guestPhone?: string;

  @Column({ nullable: true })
  roomNumber?: string;

  @Column({ type: 'date' })
  bookingDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column('decimal', { precision: 3, scale: 1 })
  duration: number;

  @Column()
  participants: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  totalCost: number;

  @Column({
    type: 'enum',
    enum: RecreationalBookingStatus,
    default: RecreationalBookingStatus.PENDING,
  })
  status: RecreationalBookingStatus;

  @Column({
    type: 'enum',
    enum: BookingPriority,
    default: BookingPriority.NORMAL,
  })
  priority: BookingPriority;

  @Column({ type: 'text', nullable: true })
  specialRequests?: string;

  @Column({ type: 'text', nullable: true })
  staffNotes?: string;

  @Column({ type: 'timestamp', nullable: true })
  actualCheckIn?: Date;

  @Column({ type: 'timestamp', nullable: true })
  actualCheckOut?: Date;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  discountPercent?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({ nullable: true })
  createdByUserId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  facilityId: number;

  @ManyToOne(() => RecreationalFacility, (facility) => facility.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'facilityId' })
  facility: RecreationalFacility;
}
