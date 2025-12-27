import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsNumber,
  Min,
} from 'class-validator';
import { Exclude } from 'class-transformer';
import { LoyaltyLevel } from '@app/contracts/auth-service';
import type { UserRole } from './user-role.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail()
  @Column({ unique: true })
  email: string;

  @IsString()
  @Exclude()
  @Column({ select: false })
  password: string;

  @IsString()
  @Column()
  name: string;

  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  phone?: string;

  @IsNumber()
  @Min(0)
  @Column({ default: 0 })
  loyaltyPoints: number;

  @IsEnum(LoyaltyLevel)
  @Column({
    type: 'enum',
    enum: LoyaltyLevel,
    default: LoyaltyLevel.BRONZE,
  })
  loyaltyLevel: LoyaltyLevel;

  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  preferences?: string;

  @CreateDateColumn()
  registrationDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastVisit?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  firstVisit?: Date;

  @IsBoolean()
  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin?: Date;

  @IsOptional()
  @IsString()
  @Exclude()
  @Column({ nullable: true, select: false })
  refreshToken?: string;

  @OneToMany('UserRole', 'user', { cascade: true })
  userRoles: UserRole[];
}
