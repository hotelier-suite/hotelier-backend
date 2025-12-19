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
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaintenanceType } from '../enums/maintenance-type.enum';
import { MaintenanceStatus } from '../enums/maintenance-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';
import { Room } from '../../rooms/entities/room.entity';

@Entity('maintenance_reports')
export class MaintenanceReport {
  @ApiProperty({
    description: 'Unique identifier for the maintenance report',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Unique report number',
    example: 'MR-2024-001',
  })
  @IsString()
  @Length(1, 50)
  @Column({ unique: true })
  reportNumber: string;

  @ApiProperty({
    description: 'Type of maintenance required',
    enum: MaintenanceType,
    example: MaintenanceType.PLUMBING,
  })
  @IsEnum(MaintenanceType)
  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @ApiProperty({
    description: 'Detailed description of the maintenance issue',
    example: 'Bathroom faucet leaking, needs immediate attention',
  })
  @IsString()
  @Length(1, 500)
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Priority level of the maintenance task',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NORMAL,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Current status of the maintenance report',
    enum: MaintenanceStatus,
    example: MaintenanceStatus.PENDING,
  })
  @IsEnum(MaintenanceStatus)
  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.PENDING,
  })
  status: MaintenanceStatus;

  @ApiProperty({
    description: 'Name of the technician assigned to this maintenance',
    example: 'Luis Fernandez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  assignedTechnician?: string;

  @ApiProperty({
    description: 'Name of the person who reported the issue',
    example: 'Mary Johnson',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  reportedBy: string;

  @ApiProperty({
    description: 'Estimated time to complete the maintenance',
    example: '2 hours',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  estimatedTime?: string;

  @ApiProperty({
    description: 'Date and time when maintenance work started',
    example: '2024-01-15T09:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @ApiProperty({
    description: 'Date and time when maintenance work was completed',
    example: '2024-01-15T11:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({
    description: 'Total cost of the maintenance work',
    example: 150.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost?: number;

  @ApiProperty({
    description: 'Additional notes about the maintenance work',
    example: 'All filters replaced, system running optimally',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Date when the record was created',
    example: '2024-01-15T08:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the record was last updated',
    example: '2024-01-15T11:00:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the room where maintenance is required',
    example: 101,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Column({ nullable: true })
  roomId?: number;

  @ApiProperty({
    description: 'Room where maintenance is required',
    type: () => Room,
    required: false,
  })
  @ManyToOne(() => Room, { nullable: true })
  @JoinColumn({ name: 'roomId' })
  room?: Room;
}
