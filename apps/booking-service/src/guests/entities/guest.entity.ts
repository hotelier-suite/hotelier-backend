import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Reservation } from '../../reservations';

@Entity('guests')
export class Guest {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'John Smith' })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({ example: 'john.smith@example.com' })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({ required: false, example: '+1234567890' })
  @IsOptional()
  @IsString()
  @Length(1, 20)
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({ required: false, example: 'ABC123456' })
  @IsOptional()
  @IsString()
  @Length(1, 50)
  @Column({ nullable: true })
  document?: string;

  @ApiProperty({ required: false, example: '123 Main St, New York, NY' })
  @IsOptional()
  @IsString()
  @Length(1, 200)
  @Column({ nullable: true })
  address?: string;

  @ApiProperty({ required: false, example: 'American' })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  nationality?: string;

  @ApiProperty({ required: false, type: String, example: '1985-05-15' })
  @IsOptional()
  @IsDate()
  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @ApiProperty({ required: false, example: 'Non-smoking room, high floor' })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  @Column({ type: 'text', nullable: true })
  preferences?: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  @Column({ default: false })
  vip: boolean;

  @ApiProperty({ type: String })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ type: String })
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('Reservation', 'guest')
  reservations: Reservation[];
}
