import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  FacilityType,
  FacilityStatus,
} from '@app/contracts/recreational-service';
import { RecreationalBooking } from '../../bookings/entities';

@Entity('recreational_facilities')
export class RecreationalFacility {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: FacilityType,
  })
  type: FacilityType;

  @Column({
    type: 'enum',
    enum: FacilityStatus,
    default: FacilityStatus.AVAILABLE,
  })
  status: FacilityStatus;

  @Column()
  capacity: number;

  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  area?: number;

  @Column()
  location: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ type: 'time' })
  openingTime: string;

  @Column({ type: 'time' })
  closingTime: string;

  @Column({ default: 1 })
  minimumBookingHours: number;

  @Column({ default: 4 })
  maximumBookingHours: number;

  @Column('json', { nullable: true })
  amenities?: string[];

  @Column('json', { nullable: true })
  rules?: string[];

  @Column({ default: 1 })
  advanceBookingHours?: number;

  @Column('json', { nullable: true })
  availableDays?: number[];

  @Column({ type: 'text', nullable: true })
  maintenanceNotes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => RecreationalBooking, (booking) => booking.facility, {
    cascade: true,
  })
  bookings: RecreationalBooking[];
}
