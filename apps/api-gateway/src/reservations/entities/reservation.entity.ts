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
  IsEmail,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDate,
  Min,
  Max,
} from 'class-validator';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { BookingChannel } from '../enums/booking-channel.enum';
import { Guest } from './guest.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity('reservations')
export class Reservation {
  @ApiProperty({
    description: 'Reservation unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Guest full name',
    example: 'John Smith',
  })
  @IsString()
  @Column()
  guestName: string;

  @ApiProperty({
    description: 'Guest email address',
    example: 'john.smith@example.com',
  })
  @IsEmail()
  @Column()
  guestEmail: string;

  @ApiProperty({
    description: 'Guest phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  guestPhone?: string;

  @ApiProperty({
    description: 'Check-in date and time',
    example: '2024-01-15T15:00:00.000Z',
  })
  @IsDate()
  @Column({ type: 'timestamp' })
  checkInDate: Date;

  @ApiProperty({
    description: 'Check-out date and time',
    example: '2024-01-18T11:00:00.000Z',
  })
  @IsDate()
  @Column({ type: 'timestamp' })
  checkOutDate: Date;

  @ApiProperty({
    description: 'Number of nights',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Column()
  nights: number;

  @ApiProperty({
    description: 'Number of guests',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Column()
  guests: number;

  @ApiProperty({
    description: 'Total reservation amount',
    example: 225.5,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @ApiProperty({
    description:
      'Optional discount percent applied to the reservation total (0-100)',
    example: 10,
    required: false,
    minimum: 0,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  discountPercent?: number | null;

  @ApiProperty({
    description:
      'Optional absolute discount amount applied to the reservation total',
    example: 20.0,
    required: false,
    minimum: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountAmount?: number | null;

  @ApiProperty({
    description: 'Reservation status',
    enum: ReservationStatus,
    example: ReservationStatus.CONFIRMED,
  })
  @IsEnum(ReservationStatus)
  @Column({
    type: 'enum',
    enum: ReservationStatus,
    default: ReservationStatus.PENDING,
  })
  status: ReservationStatus;

  @ApiProperty({
    description: 'Booking channel',
    enum: BookingChannel,
    example: BookingChannel.DIRECT,
  })
  @IsEnum(BookingChannel)
  @Column({
    type: 'enum',
    enum: BookingChannel,
    default: BookingChannel.DIRECT,
  })
  channel: BookingChannel;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Anniversary celebration, late check-in requested',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Reservation creation timestamp',
    example: '2024-01-10T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Reservation last update timestamp',
    example: '2024-01-12T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({
    description: 'User ID who created the reservation',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  userId?: number;

  @ApiProperty({
    description: 'Room ID for the reservation',
    example: 101,
  })
  @IsNumber()
  @Column()
  roomId: number;

  @ApiProperty({
    description: 'Guest ID if linked to existing guest',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Column({ nullable: true })
  guestId?: number;

  // Relations
  @ManyToOne(() => Room, { eager: true })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne(() => Guest, (guest) => guest.reservations, { nullable: true })
  @JoinColumn({ name: 'guestId' })
  guest?: Guest;
}
