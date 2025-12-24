import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('dashboard_widgets')
export class DashboardWidget {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  type: string;

  @Column('json')
  configuration: any;

  @Column('json', { nullable: true })
  data?: any;

  @Column({ default: 0 })
  position: number;

  @Column({ default: true })
  visible: boolean;

  @Column()
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
