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
  IsDate,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../enums/attendance-status.enum';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('attendance')
export class Attendance {
  @ApiProperty({
    description: 'Attendance record unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Date of attendance',
    example: '2024-01-15',
    type: Date,
  })
  @Type(() => Date)
  @IsDate()
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({
    description: 'Employee check-in time (HH:MM format)',
    example: '09:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ type: 'time', nullable: true })
  checkIn?: string;

  @ApiProperty({
    description: 'Employee check-out time (HH:MM format)',
    example: '17:30',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ type: 'time', nullable: true })
  checkOut?: string;

  @ApiProperty({
    description: 'Attendance status',
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
    required: false,
  })
  @IsOptional()
  @IsEnum(AttendanceStatus)
  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status?: AttendanceStatus;

  @ApiProperty({
    description: 'Additional notes or comments about attendance',
    example: 'Late due to traffic',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Total hours worked for the day',
    example: 8.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  hoursWorked?: number;

  @ApiProperty({
    description: 'Overtime hours worked',
    example: 1.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours?: number;

  @ApiProperty({
    description: 'Record creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Record last update timestamp',
    example: '2024-01-15T17:45:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'Employee ID associated with this attendance record',
    example: 123,
  })
  @IsInt()
  @Min(1)
  @Column()
  employeeId: number;

  @ApiProperty({
    description: 'Employee associated with this attendance record',
    type: () => Employee,
  })
  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
