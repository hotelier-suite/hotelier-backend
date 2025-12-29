import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import type { Role } from './role.entity';
import type { SystemPermission } from '../../permissions';

@Entity('role_permissions')
@Index(['roleId', 'permissionId'], { unique: true })
export class RolePermission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roleId: number;

  @Column()
  permissionId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne('Role', 'permissions', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne('SystemPermission', 'roles', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permissionId' })
  permission: SystemPermission;
}
