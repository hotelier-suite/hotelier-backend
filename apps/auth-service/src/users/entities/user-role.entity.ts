import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';
import { Role } from '../../roles/entities/role.entity';

@Entity('user_roles')
@Index(['userId', 'roleId'], { unique: true })
export class UserRole {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  roleId: number;

  @CreateDateColumn()
  assignedAt: Date;

  @Column({ nullable: true })
  assignedBy?: string;

  // Relations
  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;
}
