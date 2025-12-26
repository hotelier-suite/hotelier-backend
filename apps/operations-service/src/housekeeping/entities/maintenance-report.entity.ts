import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
  TaskPriority,
} from '@app/contracts/operations-service';

@Entity('maintenance_reports')
export class MaintenanceReport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  reportNumber: string;

  @Column({
    type: 'enum',
    enum: HousekeepingMaintenanceType,
  })
  type: HousekeepingMaintenanceType;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NORMAL,
  })
  priority: TaskPriority;

  @Column({
    type: 'enum',
    enum: HousekeepingMaintenanceStatus,
    default: HousekeepingMaintenanceStatus.PENDING,
  })
  status: HousekeepingMaintenanceStatus;

  @Column({ nullable: true })
  assignedTechnician?: string;

  @Column()
  reportedBy: string;

  @Column({ nullable: true })
  estimatedTime?: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ nullable: true })
  roomId?: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
