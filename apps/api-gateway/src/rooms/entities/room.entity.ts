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
  IsNumber,
  IsEnum,
  IsBoolean,
  IsOptional,
  IsInt,
  Min,
  Length,
} from 'class-validator';
import { RoomType } from '../enums/room-type.enum';

@Entity('rooms')
export class Room {
  @ApiProperty({
    description: 'Unique identifier for the room',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Room number',
    example: '201',
  })
  @IsString()
  @Length(1, 10)
  @Column({ unique: true })
  number: string;

  @ApiProperty({
    description: 'Type of room',
    enum: RoomType,
    example: RoomType.DOBLE,
  })
  @IsEnum(RoomType)
  @Column({
    type: 'enum',
    enum: RoomType,
  })
  type: RoomType;

  @ApiProperty({
    description: 'Room price per night',
    example: 75.0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @ApiProperty({
    description: 'Room capacity (number of guests)',
    example: 2,
  })
  @IsInt()
  @Min(1)
  @Column()
  capacity: number;

  @ApiProperty({
    description: 'Whether the room is available for booking',
    example: true,
  })
  @IsBoolean()
  @Column({ default: true })
  isAvailable: boolean;

  @ApiProperty({
    description: 'Room description',
    example: 'Spacious double room with modern amenities',
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
}
