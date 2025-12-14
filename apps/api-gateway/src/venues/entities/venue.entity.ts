import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Length,
} from 'class-validator';
import { EventBooking } from '../../events/entities/event-booking.entity';

@Entity('venues')
export class Venue {
  @ApiProperty({
    description: 'Unique identifier for the venue',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Venue name',
    example: 'Grand Ballroom',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Maximum capacity of the venue',
    example: 200,
  })
  @IsInt()
  @Min(1)
  @Column()
  capacity: number;

  @ApiProperty({
    description: 'Area of the venue in square meters',
    example: 400.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 8, scale: 2 })
  area: number;

  @ApiProperty({
    description: 'Hourly rate for venue rental',
    example: 500.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  hourlyRate: number;

  @ApiProperty({
    description: 'Whether the venue is available for booking',
    example: true,
  })
  @IsBoolean()
  @Column({ default: true })
  available: boolean;

  @ApiProperty({
    description: 'Venue location within the hotel',
    example: 'Main Building - Ground Floor',
  })
  @IsString()
  @Length(1, 200)
  @Column()
  location: string;

  @ApiProperty({
    description: 'Venue description and features',
    example: 'Elegant ballroom perfect for weddings and corporate events',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Last update timestamp',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => EventBooking, (event) => event.venue, { cascade: true })
  events: EventBooking[];
}
