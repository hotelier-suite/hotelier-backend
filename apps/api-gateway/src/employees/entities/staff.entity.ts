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
  IsEmail,
  IsDateString,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Department } from '../enums/department.enum';
import { StaffStatus } from '../enums/staff-status.enum';

@Entity('staff')
export class Staff {
  @ApiProperty({
    description: 'Staff member unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Staff member employee ID code',
    example: 'STF001',
  })
  @IsString()
  @Length(1, 20)
  @Column({ unique: true })
  employeeId: string;

  @ApiProperty({
    description: 'Staff member full name',
    example: 'Elena Morales',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Staff member email address',
    example: 'elena.morales@hotelier.com',
  })
  @IsEmail()
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    description: 'Staff member phone number',
    example: '+1234567800',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  phone?: string;

  @ApiProperty({
    description: 'Staff member department',
    enum: Department,
    example: Department.HOUSEKEEPING,
  })
  @IsEnum(Department)
  @Column({
    type: 'enum',
    enum: Department,
  })
  department: Department;

  @ApiProperty({
    description: 'Staff member position/job title',
    example: 'Head of Housekeeping',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  position: string;

  @ApiProperty({
    description: 'Staff member salary',
    example: 4500.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  salary?: number;

  @ApiProperty({
    description: 'Staff member hire date',
    example: '2022-01-15',
  })
  @IsDateString()
  @Type(() => Date)
  @Column({ type: 'date' })
  hireDate: Date;

  @ApiProperty({
    description: 'Staff member status',
    enum: StaffStatus,
    example: StaffStatus.ACTIVE,
    required: false,
  })
  @IsOptional()
  @IsEnum(StaffStatus)
  @Column({
    type: 'enum',
    enum: StaffStatus,
    default: StaffStatus.ACTIVE,
  })
  status?: StaffStatus;

  @ApiProperty({
    description: 'Staff member work schedule',
    example: 'Monday to Friday, 6:00 AM - 2:00 PM',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  schedule?: string;

  @ApiProperty({
    description: 'Staff member creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Staff member last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
