import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  MaintenanceStatus,
  MaintenancePriority,
  MaintenanceType,
} from '@app/contracts/operations-service';

@Entity('general_maintenance_requests')
export class GeneralMaintenanceRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @Column({
    type: 'enum',
    enum: MaintenancePriority,
  })
  priority: MaintenancePriority;

  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status: MaintenanceStatus;

  @Column()
  location: string;

  @Column({ nullable: true })
  equipment?: string;

  @Column({ type: 'date', nullable: true })
  scheduledDate?: Date;

  @Column({ nullable: true })
  scheduledStartTime?: string;

  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  estimatedDuration?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualCost?: number;

  @Column({ nullable: true })
  assignedTechnicianId?: number;

  @Column({ nullable: true })
  requestedById?: number;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'text', nullable: true })
  workPerformed?: string;

  @Column({ type: 'text', nullable: true })
  materialsUsed?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
