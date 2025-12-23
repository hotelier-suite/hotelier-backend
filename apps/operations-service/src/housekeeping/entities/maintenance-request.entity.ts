import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { HousekeepingMaintenanceType } from '@app/contracts/operations-service/housekeeping/enums/maintenance-type.enum';
import { HousekeepingMaintenanceStatus } from '@app/contracts/operations-service/housekeeping/enums/maintenance-status.enum';
import { TaskPriority } from '@app/contracts/operations-service/housekeeping/enums/task-priority.enum';

@Entity('housekeeping_maintenance_requests')
export class MaintenanceRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomNumber: string;

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

  @Column()
  reportedBy: string;

  @Column({ nullable: true })
  assignedTo?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reportDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  resolvedDate?: Date;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  cost?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column()
  roomId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
