import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';
import {
  ReservationStatus,
  BookingChannel,
} from '@app/contracts/booking-service';
import { DecimalTransformer } from '@app/contracts/common';
import { Guest } from '../../guests';
import { Room } from '../../rooms';

@Entity('reservations')
export class Reservation {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @Length(1, 100)
  @Column()
  guestName: string;

  @ApiProperty({ example: 'john.smith@example.com' })
  @IsEmail()
  @Column()
  guestEmail: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Column({ nullable: true })
  guestPhone?: string;

  @ApiProperty({ type: String, example: '2024-01-15T15:00:00.000Z' })
  @IsDate()
  @Column({ type: 'timestamp' })
  checkInDate: Date;

  @ApiProperty({ type: String, example: '2024-01-18T11:00:00.000Z' })
  @IsDate()
  @Column({ type: 'timestamp' })
  checkOutDate: Date;

  @ApiProperty({ example: 3, minimum: 1 })
  @IsInt()
  @Min(1)
  @Column({ type: 'int' })
  nights: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  @Column({ type: 'int' })
  guests: number;

  @ApiProperty({ example: 225.5, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  totalAmount: number;

  @ApiProperty({ required: false, example: 10, minimum: 0, maximum: 100 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Column('decimal', {
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  discountPercent?: number | null;

  @ApiProperty({ required: false, example: 20.0, minimum: 0 })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    nullable: true,
    transformer: DecimalTransformer,
  })
  discountAmount?: number | null;

  @ApiProperty({
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

  @ApiProperty({ enum: BookingChannel, example: BookingChannel.DIRECT })
  @IsEnum(BookingChannel)
  @Column({
    type: 'enum',
    enum: BookingChannel,
    default: BookingChannel.DIRECT,
  })
  channel: BookingChannel;

  @ApiProperty({ required: false, example: 'Anniversary celebration' })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({ type: String })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: String })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ required: false, example: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ type: 'int', nullable: true })
  userId?: number;

  @ApiProperty({ example: 101 })
  @IsInt()
  @Min(1)
  @Column({ type: 'int' })
  roomId: number;

  @ApiProperty({ required: false, example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ type: 'int', nullable: true })
  guestId?: number;

  @ManyToOne('Room', { eager: true })
  @JoinColumn({ name: 'roomId' })
  room: Room;

  @ManyToOne('Guest', { nullable: true })
  @JoinColumn({ name: 'guestId' })
  guest?: Guest;
}
