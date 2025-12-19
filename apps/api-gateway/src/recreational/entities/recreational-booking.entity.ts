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
  IsInt,
  IsNumber,
  IsEmail,
  IsDateString,
  Length,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RecreationalBookingStatus } from '../enums/booking-status.enum';
import { BookingPriority } from '../enums/booking-priority.enum';
import { RecreationalFacility } from './recreational-facility.entity';

@Entity('recreational_bookings')
export class RecreationalBooking {
  @ApiProperty({
    description: 'Recreational booking unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Guest name making the booking',
    example: 'Sarah Johnson',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  guestName: string;

  @ApiProperty({
    description: 'Guest email address',
    example: 'sarah.johnson@email.com',
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
  @Length(1, 20)
  @Column({ nullable: true })
  guestPhone?: string;

  @ApiProperty({
    description: 'Room number of the guest',
    example: '305',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  @Column({ nullable: true })
  roomNumber?: string;

  @ApiProperty({
    description: 'Booking date',
    example: '2024-12-15',
  })
  @IsDateString()
  @Type(() => Date)
  @Column({ type: 'date' })
  bookingDate: Date;

  @ApiProperty({
    description: 'Booking start time',
    example: '14:00',
  })
  @IsString()
  @Length(5, 5)
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({
    description: 'Booking end time',
    example: '16:00',
  })
  @IsString()
  @Length(5, 5)
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({
    description: 'Duration of booking in hours',
    example: 2,
    minimum: 1,
    maximum: 24,
  })
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(24)
  @Column('decimal', { precision: 3, scale: 1 })
  duration: number;

  @ApiProperty({
    description: 'Number of participants',
    example: 3,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Column()
  participants: number;

  @ApiProperty({
    description: 'Total cost of the booking',
    example: 50.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  totalCost: number;

  @ApiProperty({
    description: 'Booking status',
    enum: RecreationalBookingStatus,
    example: RecreationalBookingStatus.CONFIRMED,
    required: false,
  })
  @IsOptional()
  @IsEnum(RecreationalBookingStatus)
  @Column({
    type: 'enum',
    enum: RecreationalBookingStatus,
    default: RecreationalBookingStatus.PENDING,
  })
  status?: RecreationalBookingStatus;

  @ApiProperty({
    description: 'Booking priority level',
    enum: BookingPriority,
    example: BookingPriority.NORMAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(BookingPriority)
  @Column({
    type: 'enum',
    enum: BookingPriority,
    default: BookingPriority.NORMAL,
  })
  priority?: BookingPriority;

  @ApiProperty({
    description: 'Special requests or notes',
    example: 'Need pool towels for 3 guests',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  specialRequests?: string;

  @ApiProperty({
    description: 'Staff notes about the booking',
    example: 'VIP guest - provide premium service',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  staffNotes?: string;

  @ApiProperty({
    description: 'Actual check-in time',
    example: '2024-12-15T14:05:00.000Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  actualCheckIn?: Date;

  @ApiProperty({
    description: 'Actual check-out time',
    example: '2024-12-15T15:58:00.000Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  actualCheckOut?: Date;

  @ApiProperty({
    description: 'Discount percentage applied',
    example: 15,
    minimum: 0,
    maximum: 100,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  discountPercent?: number;

  @ApiProperty({
    description: 'Discount amount applied',
    example: 7.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @ApiProperty({
    description: 'User ID who created the booking',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ nullable: true })
  createdByUserId?: number;

  @ApiProperty({
    description: 'Booking creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Booking last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Facility ID for this booking',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Column()
  facilityId: number;

  // Relations
  @ApiProperty({
    description: 'Recreational facility details',
    type: () => RecreationalFacility,
  })
  @ManyToOne(() => RecreationalFacility, (facility) => facility.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'facilityId' })
  facility: RecreationalFacility;
}
