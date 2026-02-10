import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CleaningStatus } from '@app/contracts/operations-service';

@Entity('cleaning_assignments')
export class CleaningAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  assignedDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({
    type: 'enum',
    enum: CleaningStatus,
    default: CleaningStatus.PENDING,
  })
  status: CleaningStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column('decimal', { precision: 3, scale: 2, nullable: true })
  qualityScore?: number;

  @Column({ nullable: true })
  employeeId?: number;

  @Column()
  roomId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
