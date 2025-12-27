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
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  EmployeeRequestType,
  EmployeeRequestStatus,
} from '@app/contracts/staff-service';
import { Employee } from '../../employees';

@Entity('employee_requests')
export class EmployeeRequest {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @IsEnum(EmployeeRequestType)
  @Column({
    type: 'enum',
    enum: EmployeeRequestType,
  })
  type: EmployeeRequestType;

  @IsString()
  @Length(1, 500)
  @Column({ type: 'text' })
  reason: string;

  @Type(() => Date)
  @Column({ type: 'date' })
  startDate: Date;

  @Type(() => Date)
  @Column({ type: 'date' })
  endDate: Date;

  @IsNumber()
  @Min(1)
  @Column()
  days: number;

  @IsEnum(EmployeeRequestStatus)
  @Column({
    type: 'enum',
    enum: EmployeeRequestStatus,
    default: EmployeeRequestStatus.PENDING,
  })
  status: EmployeeRequestStatus;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  approvedBy?: string;

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
