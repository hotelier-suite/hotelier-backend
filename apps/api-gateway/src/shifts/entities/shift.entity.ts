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
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Length,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShiftType } from '../enums/shift-type.enum';
import { ShiftStatus } from '../enums/shift-status.enum';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('shifts')
export class Shift {
  @ApiProperty({
    description: 'Unique identifier for the shift',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Shift date',
    example: '2024-01-15',
  })
  @Type(() => Date)
  @Column({ type: 'date' })
  date: Date;

  @ApiProperty({
    description: 'Shift start time',
    example: '08:00',
  })
  @IsString()
  @Length(1, 10)
  @Column({ type: 'time' })
  startTime: string;

  @ApiProperty({
    description: 'Shift end time',
    example: '16:00',
  })
  @IsString()
  @Length(1, 10)
  @Column({ type: 'time' })
  endTime: string;

  @ApiProperty({
    description: 'Type of shift',
    enum: ShiftType,
    example: ShiftType.MORNING,
  })
  @IsEnum(ShiftType)
  @Column({
    type: 'enum',
    enum: ShiftType,
  })
  type: ShiftType;

  @ApiProperty({
    description: 'Current status of the shift',
    enum: ShiftStatus,
    example: ShiftStatus.SCHEDULED,
  })
  @IsEnum(ShiftStatus)
  @Column({
    type: 'enum',
    enum: ShiftStatus,
    default: ShiftStatus.SCHEDULED,
  })
  status: ShiftStatus;

  @ApiProperty({
    description: 'Employee position for this shift',
    example: 'Front Desk Agent',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  position: string;

  @ApiProperty({
    description: 'Department for this shift',
    example: 'Reception',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  department: string;

  @ApiProperty({
    description: 'Additional notes for the shift',
    example: 'Training new employee',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Column({ type: 'text', nullable: true })
  notes?: string;

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
    description: 'Employee ID assigned to this shift',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @Column()
  employeeId: number;

  // Relations
  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;
}
