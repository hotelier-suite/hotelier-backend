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
import { CleaningStatus } from '../enums/cleaning-status.enum';
import { TaskPriority } from '../enums/task-priority.enum';
import { Room } from '../../rooms/entities/room.entity';

@Entity('cleaning_tasks')
export class CleaningTask {
  @ApiProperty({
    description: 'Unique identifier for the cleaning task',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Room number to be cleaned',
    example: '101',
  })
  @IsString()
  @Length(1, 10)
  @Column()
  roomNumber: string;

  @ApiProperty({
    description: 'Current status of the cleaning task',
    enum: CleaningStatus,
    example: CleaningStatus.PENDING,
  })
  @IsEnum(CleaningStatus)
  @Column({
    type: 'enum',
    enum: CleaningStatus,
    default: CleaningStatus.PENDING,
  })
  status: CleaningStatus;

  @ApiProperty({
    description: 'Name of the employee assigned to this task',
    example: 'Mary Johnson',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  assignedEmployee?: string;

  @ApiProperty({
    description: 'Additional notes about the cleaning task',
    example: 'Deep cleaning required',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Time when the cleaning started',
    example: '2024-01-15T09:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  startTime?: Date;

  @ApiProperty({
    description: 'Time when the cleaning ended',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  @ApiProperty({
    description: 'Estimated time to complete the task (in minutes)',
    example: 45,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Column({ nullable: true })
  estimatedTime?: number;

  @ApiProperty({
    description: 'Priority level of the cleaning task',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
  })
  @IsEnum(TaskPriority)
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NORMAL,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Date when the record was created',
    example: '2024-01-15T08:00:00Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the record was last updated',
    example: '2024-01-15T10:30:00Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    description: 'ID of the room to be cleaned',
    example: 101,
  })
  @IsNumber()
  @Min(1)
  @Column()
  roomId: number;

  @ApiProperty({
    description: 'Room to be cleaned',
    type: () => Room,
  })
  @ManyToOne(() => Room)
  @JoinColumn({ name: 'roomId' })
  room: Room;
}
