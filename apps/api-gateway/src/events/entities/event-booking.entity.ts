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
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../enums/event-status.enum';
import { Venue } from '../../venues/entities/venue.entity';
import { Guest } from '../../reservations/entities/guest.entity';

@Entity('event_bookings')
export class EventBooking {
  @ApiProperty({
    description: 'Event booking unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Event booking title',
    example: 'Smith Family Reunion',
  })
  @IsString()
  @Length(1, 200)
  @Column()
  title: string;

  @ApiProperty({
    description: 'Event booking description',
    example: 'Annual family gathering with lunch, activities, and celebration.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Event date',
    example: '2024-12-14',
  })
  @IsDateString()
  @Type(() => Date)
  @Column({ type: 'date' })
  eventDate: Date;

  @ApiProperty({
    description: 'Event start time',
    example: '11:00',
  })
  @IsString()
  @Length(1, 20)
  @Column()
  startTime: string;

  @ApiProperty({
    description: 'Event end time',
    example: '16:00',
  })
  @IsString()
  @Length(1, 20)
  @Column()
  endTime: string;

  @ApiProperty({
    description: 'Number of attendees',
    example: 80,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Column()
  attendees: number;

  @ApiProperty({
    description: 'Total cost of the event',
    example: 2400.0,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  totalCost: number;

  @ApiProperty({
    description: 'Event booking status',
    enum: EventStatus,
    example: EventStatus.PLANNED,
    required: false,
  })
  @IsOptional()
  @IsEnum(EventStatus)
  @Column({
    type: 'enum',
    enum: EventStatus,
    default: EventStatus.PLANNED,
  })
  status?: EventStatus;

  @ApiProperty({
    description: 'Client name',
    example: 'James Smith',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  clientName: string;

  @ApiProperty({
    description: 'Client email address',
    example: 'carlos.martinez@email.com',
  })
  @IsEmail()
  @Column()
  clientEmail: string;

  @ApiProperty({
    description: 'Client phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Column({ nullable: true })
  clientPhone?: string;

  @ApiProperty({
    description: 'Additional notes for the event',
    example: 'Family has dietary restrictions - vegetarian options required',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Event booking creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Event booking last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Venue ID for the event',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Column()
  venueId: number;

  @ApiProperty({
    description: 'Venue details',
    type: () => Venue,
  })
  @ManyToOne(() => Venue, (venue) => venue.events)
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @ApiProperty({
    description: 'Guest ID associated with the event (optional)',
    example: 1,
    minimum: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ nullable: true })
  guestId?: number;

  @ApiProperty({
    description: 'Guest details',
    type: () => Guest,
    required: false,
  })
  @ManyToOne(() => Guest, { nullable: true })
  @JoinColumn({ name: 'guestId' })
  guest?: Guest;
}
