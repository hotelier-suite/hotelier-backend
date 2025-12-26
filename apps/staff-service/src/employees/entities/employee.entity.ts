import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  Length,
} from 'class-validator';
import { Department, StaffStatus } from '@app/contracts/staff-service';

@Entity('employees')
export class Employee {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(1, 20)
  @Column({ unique: true })
  employeeId: string;

  @IsString()
  @Length(1, 100)
  @Column()
  name: string;

  @IsEnum(Department)
  @Column({
    type: 'enum',
    enum: Department,
  })
  department: Department;

  @IsString()
  @Length(1, 100)
  @Column()
  position: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  shift?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  assignedRooms?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Column({ default: 0 })
  completedRooms?: number;

  @IsOptional()
  @IsEnum(StaffStatus)
  @Column({
    type: 'enum',
    enum: StaffStatus,
    default: StaffStatus.ACTIVE,
  })
  status?: StaffStatus;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  currentLocation?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
