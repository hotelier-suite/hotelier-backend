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
  Min,
  Length,
} from 'class-validator';
import { Department } from '../enums/department.enum';
import { StaffStatus } from '../enums/staff-status.enum';

@Entity('employees')
export class Employee {
  @ApiProperty({
    description: 'Employee unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Employee ID code',
    example: 'EMP001',
  })
  @IsString()
  @Length(1, 20)
  @Column({ unique: true })
  employeeId: string;

  @ApiProperty({
    description: 'Employee full name',
    example: 'Mary Johnson',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @ApiProperty({
    description: 'Employee department',
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
    description: 'Employee position/job title',
    example: 'Housekeeping Supervisor',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  position: string;

  @ApiProperty({
    description: 'Employee work shift',
    example: 'Morning',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  shift?: string;

  @ApiProperty({
    description: 'Number of rooms assigned to employee',
    example: 15,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  assignedRooms?: number;

  @ApiProperty({
    description: 'Number of rooms completed by employee',
    example: 12,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  completedRooms?: number;

  @ApiProperty({
    description: 'Employee status',
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
    description: 'Employee current location',
    example: 'Floor 2',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  currentLocation?: string;

  @ApiProperty({
    description: 'Employee creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Employee last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
