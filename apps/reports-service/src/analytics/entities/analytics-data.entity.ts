import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AnalyticsMetric } from '@app/contracts/reports-service';

@Entity('analytics_data')
export class AnalyticsData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AnalyticsMetric,
  })
  metric: AnalyticsMetric;

  @Column('decimal', { precision: 10, scale: 2 })
  value: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  period?: string;

  @Column('json', { nullable: true })
  metadata?: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
