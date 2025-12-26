import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  CleaningStatus,
  TaskPriority,
} from '@app/contracts/operations-service';

@Entity('cleaning_tasks')
export class CleaningTask {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomNumber: string;

  @Column({
    type: 'enum',
    enum: CleaningStatus,
    default: CleaningStatus.PENDING,
  })
  status: CleaningStatus;

  @Column({ nullable: true })
  assignedEmployee?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  startTime?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime?: Date;

  @Column({ nullable: true })
  estimatedTime?: number;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NORMAL,
  })
  priority: TaskPriority;

  @Column()
  roomId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
