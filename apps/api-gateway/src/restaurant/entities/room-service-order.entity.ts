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
  IsNumber,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Length,
  IsArray,
} from 'class-validator';
import { RoomServiceStatus } from '../enums/room-service-status.enum';
import { Guest } from '../../reservations/entities/guest.entity';
import { DecimalTransformer } from '../../database/transformers/decimal.transformer';

@Entity('room_service_orders')
export class RoomServiceOrder {
  @ApiProperty({
    description: 'Unique identifier for the room service order',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique order number',
    example: 'RS-2024-001',
  })
  @IsString()
  @Length(1, 50)
  @Column({ unique: true })
  orderNumber: string;

  @ApiProperty({
    description: 'Room number',
    example: '201',
  })
  @IsString()
  @Length(1, 10)
  @Column()
  room: string;

  @ApiProperty({
    description: 'Guest name',
    example: 'John Smith',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  guest: string;

  @ApiProperty({
    description: 'List of ordered items as JSON',
    example: [{ item: 'Club Sandwich', quantity: 1, price: 18.5 }],
  })
  @IsArray()
  @Column('json')
  items: any[];

  @ApiProperty({
    description: 'Total amount of the order',
    example: 33.5,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: DecimalTransformer,
  })
  total: number;

  @ApiProperty({
    description: 'Time when the order was placed',
    example: '14:30',
  })
  @IsString()
  @Length(1, 10)
  @Column()
  orderTime: string;

  @ApiProperty({
    description: 'Estimated delivery time',
    example: '25 minutes',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Column({ nullable: true })
  estimatedTime?: string;

  @ApiProperty({
    description: 'Current status of the order',
    enum: RoomServiceStatus,
    example: RoomServiceStatus.PENDING,
  })
  @IsEnum(RoomServiceStatus)
  @Column({
    type: 'enum',
    enum: RoomServiceStatus,
    default: RoomServiceStatus.PENDING,
  })
  status: RoomServiceStatus;

  @ApiProperty({
    description: 'Assigned waiter',
    example: 'Sarah Davis',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  waiter?: string;

  @ApiProperty({
    description: 'Special instructions for the order',
    example: 'Guest has nut allergy',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  @Column({ type: 'text', nullable: true })
  specialInstructions?: string;

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

  @ApiProperty({
    description: 'Guest ID (optional - for linking orders to hotel guests)',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ nullable: true })
  guestId?: number;

  @ApiProperty({
    description: 'Guest details (if linked to a hotel guest)',
    type: () => Guest,
    required: false,
  })
  @ManyToOne(() => Guest, { nullable: true })
  @JoinColumn({ name: 'guestId' })
  guestDetails?: Guest;
}
