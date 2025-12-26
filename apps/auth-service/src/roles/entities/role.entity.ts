import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import type { UserRole } from '../../users';
import type { RolePermission } from './role-permission.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Column({ unique: true })
  name: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  description?: string;

  @IsBoolean()
  @Column({ default: false })
  isSystem: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany('UserRole', 'role', { cascade: true })
  userRoles: UserRole[];

  @OneToMany('RolePermission', 'role', {
    cascade: true,
  })
  permissions: RolePermission[];
}
