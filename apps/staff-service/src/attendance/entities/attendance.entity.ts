import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@app/contracts/staff-service';
import { Employee } from '../../employees';

@Entity('attendance')
export class Attendance {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @Type(() => Date)
  @IsDate()
  @Column({ type: 'date' })
  date: Date;

  @IsOptional()
  @IsString()
  @Column({ type: 'time', nullable: true })
  checkIn?: string;

  @IsOptional()
  @IsString()
  @Column({ type: 'time', nullable: true })
  checkOut?: string;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.PRESENT,
  })
  status?: AttendanceStatus;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 5,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number.parseFloat(value),
    },
  })
  hoursWorked?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', {
    precision: 5,
    scale: 2,
    default: 0,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => Number.parseFloat(value),
    },
  })
  overtimeHours?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @IsInt()
  @Min(1)
  @Column()
  employeeId: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
