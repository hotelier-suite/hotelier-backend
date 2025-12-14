import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import type { RolePermission } from '../../roles/entities/role-permission.entity';

@Entity('system_permissions')
@Index(['resource', 'action'], { unique: true })
export class SystemPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column()
  resource: string;

  @IsString()
  @Column()
  action: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  description?: string;

  @IsBoolean()
  @Column({ default: true })
  active: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany('RolePermission', 'permission', { cascade: true })
  roles: RolePermission[];
}
