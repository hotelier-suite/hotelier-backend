import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

@Entity('audit_logs')
@Index(['action', 'resource', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['resource', 'resourceId', 'createdAt'])
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditResource,
  })
  resource: AuditResource;

  @Column({ nullable: true })
  resourceId?: string;

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, unknown>;

  @Column({ type: 'text' })
  description: string;

  @CreateDateColumn()
  createdAt: Date;
}
