import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  IsDateString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventStatus } from '../enums/event-status.enum';

@Entity('events')
export class Event {
  @ApiProperty({
    description: 'Event unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Event title',
    example: 'Annual Corporate Retreat',
  })
  @IsString()
  @Length(1, 200)
  @Column()
  title: string;

  @ApiProperty({
    description: 'Event description',
    example:
      'Company-wide retreat focusing on team building and strategic planning.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Event date',
    example: '2024-12-15',
  })
  @IsDateString()
  @Type(() => Date)
  @Column({ type: 'date' })
  eventDate: Date;

  @ApiProperty({
    description: 'Event start time',
    example: '09:00',
  })
  @IsString()
  @Length(1, 20)
  @Column()
  startTime: string;

  @ApiProperty({
    description: 'Event end time',
    example: '17:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Column({ nullable: true })
  endTime?: string;

  @ApiProperty({
    description: 'Event venue',
    example: 'Conference Room Alpha',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  venue: string;

  @ApiProperty({
    description: 'Venue capacity',
    example: 50,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  @Column()
  capacity: number;

  @ApiProperty({
    description: 'Number of attendees',
    example: 45,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  attendees?: number;

  @ApiProperty({
    description: 'Event status',
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
    description: 'Event organizer',
    example: 'TechCorp Inc.',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  organizer: string;

  @ApiProperty({
    description: 'Event cost',
    example: 1200.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost?: number;

  @ApiProperty({
    description: 'Event revenue',
    example: 2500.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  revenue?: number;

  @ApiProperty({
    description: 'Event creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Event last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
