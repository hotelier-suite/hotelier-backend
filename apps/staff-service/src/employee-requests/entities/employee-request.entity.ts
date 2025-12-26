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
import { RequestType, RequestStatus } from '@app/contracts/staff-service';
import { Employee } from '../../employees';

@Entity('employee_requests')
export class EmployeeRequest {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @IsEnum(RequestType)
  @Column({
    type: 'enum',
    enum: RequestType,
  })
  type: RequestType;

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

  @IsEnum(RequestStatus)
  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

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
