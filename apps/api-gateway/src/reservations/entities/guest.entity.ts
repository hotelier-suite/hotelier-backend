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
  IsEmail,
  IsOptional,
  IsBoolean,
  IsDate,
} from 'class-validator';
import { Reservation } from './reservation.entity';

@Entity('guests')
export class Guest {
  @ApiProperty({
    description: 'Guest unique identifier',
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
  name: string;

  @ApiProperty({
    description: 'Guest email address',
    example: 'john.smith@example.com',
  })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Guest phone number',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({
    description: 'Guest identification document',
    example: 'ABC123456',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  document?: string;

  @ApiProperty({
    description: 'Guest address',
    example: '123 Main St, New York, NY',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({
    description: 'Guest nationality',
    example: 'American',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  nationality?: string;

  @ApiProperty({
    description: 'Guest birth date',
    example: '1985-05-15',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @ApiProperty({
    description: 'Guest preferences and notes',
    example: 'Non-smoking room, high floor',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  preferences?: string;

  @ApiProperty({
    description: 'Whether the guest is VIP',
    example: false,
  })
  @IsBoolean()
  @Column({ default: false })
  vip: boolean;

  @ApiProperty({
    description: 'Guest registration timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Guest last update timestamp',
    example: '2024-01-15T11:45:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Reservation, (reservation) => reservation.guest)
  reservations: Reservation[];
}
