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
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Length,
} from 'class-validator';
import { ShiftType, ShiftStatus } from '@app/contracts/staff-service';
import { Employee } from '../../employees';

@Entity('shifts')
export class Shift {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @IsString()
  @Length(1, 10)
  @Column({ type: 'time' })
  startTime: string;

  @IsString()
  @Length(1, 10)
  @Column({ type: 'time' })
  endTime: string;

  @IsEnum(ShiftType)
  @Column({
    type: 'enum',
    enum: ShiftType,
  })
  type: ShiftType;

  @IsEnum(ShiftStatus)
  @Column({
    type: 'enum',
    enum: ShiftStatus,
    default: ShiftStatus.SCHEDULED,
  })
  status: ShiftStatus;

  @IsString()
  @Length(1, 100)
  @Column()
  position: string;

  @IsString()
  @Length(1, 100)
  @Column()
  department: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Column({ type: 'text', nullable: true })
  notes?: string;

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
