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
  IsEnum,
  IsOptional,
  IsInt,
  IsNumber,
  IsBoolean,
  IsArray,
  Length,
  Min,
  Max,
} from 'class-validator';
import { FacilityType } from '../enums/facility-type.enum';
import { FacilityStatus } from '../enums/facility-status.enum';
import { RecreationalBooking } from './recreational-booking.entity';

@Entity('recreational_facilities')
export class RecreationalFacility {
  @ApiProperty({
    description: 'Recreational facility unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Facility name',
    example: 'Olympic Swimming Pool',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Type of recreational facility',
    enum: FacilityType,
    example: FacilityType.SWIMMING_POOL,
  })
  @IsEnum(FacilityType)
  @Column({
    type: 'enum',
    enum: FacilityType,
  })
  type: FacilityType;

  @ApiProperty({
    description: 'Current facility status',
    enum: FacilityStatus,
    example: FacilityStatus.AVAILABLE,
    required: false,
  })
  @IsOptional()
  @IsEnum(FacilityStatus)
  @Column({
    type: 'enum',
    enum: FacilityStatus,
    default: FacilityStatus.AVAILABLE,
  })
  status?: FacilityStatus;

  @ApiProperty({
    description: 'Maximum capacity of the facility',
    example: 20,
  })
  @IsInt()
  @Min(1)
  @Column()
  capacity: number;

  @ApiProperty({
    description: 'Facility area in square meters',
    example: 200.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 8, scale: 2, nullable: true })
  area?: number;

  @ApiProperty({
    description: 'Facility location within the hotel',
    example: 'Wellness Center - 2nd Floor',
  })
  @IsString()
  @Length(1, 200)
  @Column()
  location: string;

  @ApiProperty({
    description: 'Facility description and features',
    example: 'Heated outdoor pool with lap lanes and children area',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Hourly rate for facility booking',
    example: 25.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  hourlyRate?: number;

  @ApiProperty({
    description: 'Whether the facility is currently available for booking',
    example: true,
  })
  @IsBoolean()
  @Column({ default: true })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Operating hours start time',
    example: '06:00',
  })
  @IsString()
  @Length(5, 5)
  @Column({ type: 'time' })
  openingTime: string;

  @ApiProperty({
    description: 'Operating hours end time',
    example: '22:00',
  })
  @IsString()
  @Length(5, 5)
  @Column({ type: 'time' })
  closingTime: string;

  @ApiProperty({
    description: 'Minimum booking duration in hours',
    example: 1,
    minimum: 1,
    maximum: 24,
  })
  @IsInt()
  @Min(1)
  @Max(24)
  @Column({ default: 1 })
  minimumBookingHours: number;

  @ApiProperty({
    description: 'Maximum booking duration in hours',
    example: 4,
    minimum: 1,
    maximum: 24,
  })
  @IsInt()
  @Min(1)
  @Max(24)
  @Column({ default: 4 })
  maximumBookingHours: number;

  @ApiProperty({
    description: 'Required equipment or amenities (JSON array)',
    example: ['Pool towels', 'Swimming caps required', 'Lifeguard on duty'],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Column('json', { nullable: true })
  amenities?: string[];

  @ApiProperty({
    description: 'Special rules and requirements (JSON array)',
    example: [
      'No outside food',
      'Children under 12 must be supervised',
      'Maximum 2 hour sessions',
    ],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Column('json', { nullable: true })
  rules?: string[];

  @ApiProperty({
    description: 'Advance booking required in hours',
    example: 2,
    minimum: 0,
    maximum: 168,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(168) // Max 1 week
  @Column({ default: 1 })
  advanceBookingHours?: number;

  @ApiProperty({
    description:
      'Days of the week when facility is available (0=Sunday, 6=Saturday)',
    example: [1, 2, 3, 4, 5, 6, 0],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @Column('json', { nullable: true })
  availableDays?: number[];

  @ApiProperty({
    description: 'Maintenance schedule notes',
    example: 'Daily cleaning 5:00-6:00 AM',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Column({ type: 'text', nullable: true })
  maintenanceNotes?: string;

  @ApiProperty({
    description: 'Facility creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Facility last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ApiProperty({
    description: 'Bookings for this facility',
    type: () => Array,
    isArray: true,
  })
  @OneToMany(() => RecreationalBooking, (booking) => booking.facility, {
    cascade: true,
  })
  bookings: RecreationalBooking[];
}
