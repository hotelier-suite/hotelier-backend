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
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequestType } from '../enums/request-type.enum';
import { RequestStatus } from '../enums/request-status.enum';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('employee_requests')
export class EmployeeRequest {
  @ApiProperty({
    description: 'Unique identifier for the employee request',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Type of request',
    enum: RequestType,
    example: RequestType.VACATION,
  })
  @IsEnum(RequestType)
  @Column({
    type: 'enum',
    enum: RequestType,
  })
  type: RequestType;

  @ApiProperty({
    description: 'Reason for the request',
    example: 'Family vacation',
  })
  @IsString()
  @Length(1, 500)
  @Column({ type: 'text' })
  reason: string;

  @ApiProperty({
    description: 'Start date of the request',
    example: '2024-01-15',
  })
  @Type(() => Date)
  @Column({ type: 'date' })
  startDate: Date;

  @ApiProperty({
    description: 'End date of the request',
    example: '2024-01-20',
  })
  @Type(() => Date)
  @Column({ type: 'date' })
  endDate: Date;

  @ApiProperty({
    description: 'Number of days requested',
    example: 5,
    minimum: 1,
  })
  @IsNumber()
  @Min(1)
  @Column()
  days: number;

  @ApiProperty({
    description: 'Current status of the request',
    enum: RequestStatus,
    example: RequestStatus.PENDING,
  })
  @IsEnum(RequestStatus)
  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status: RequestStatus;

  @ApiProperty({
    description: 'Name of person who approved/rejected the request',
    example: 'Manager Smith',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  approvedBy?: string;

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
    description: 'Employee ID who made the request',
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
