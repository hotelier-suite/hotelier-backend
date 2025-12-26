import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { RoomType } from '@app/contracts/booking-service';

@Entity('rooms')
export class Room {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: '201' })
  @IsString()
  @Length(1, 10)
  @Column({ unique: true })
  number: string;

  @ApiProperty({ enum: RoomType, example: RoomType.DOBLE })
  @IsEnum(RoomType)
  @Column({
    type: 'enum',
    enum: RoomType,
  })
  type: RoomType;

  @ApiProperty({ example: 75.0, minimum: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number.parseFloat(value),
    },
  })
  price: number;

  @ApiProperty({ example: 2, minimum: 1 })
  @IsInt()
  @Min(1)
  @Column()
  capacity: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @Column({ default: true })
  isAvailable: boolean;

  @ApiProperty({
    required: false,
    example: 'Spacious double room with modern amenities',
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({ type: String })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: String })
  @UpdateDateColumn()
  updatedAt: Date;
}
