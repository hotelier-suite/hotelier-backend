import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsObject,
} from 'class-validator';
import { AuditAction } from '../enums/audit-action.enum';
import { AuditResource } from '../enums/audit-resource.enum';

@Entity('audit_logs')
@Index(['action', 'resource', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['resource', 'resourceId', 'createdAt'])
export class AuditLog {
  @ApiProperty({
    description: 'Audit log unique identifier',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'User who performed the action',
    example: 1,
  })
  @IsNumber()
  @Column()
  userId: number;

  @ApiProperty({
    description: 'Action performed',
    enum: AuditAction,
    example: AuditAction.CREATE,
  })
  @IsEnum(AuditAction)
  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @ApiProperty({
    description: 'Resource affected',
    enum: AuditResource,
    example: AuditResource.RESERVATION,
  })
  @IsEnum(AuditResource)
  @Column({
    type: 'enum',
    enum: AuditResource,
  })
  resource: AuditResource;

  @ApiProperty({
    description: 'ID of the affected resource',
    example: '123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ nullable: true })
  resourceId?: string;

  @ApiProperty({
    description: 'User agent string',
    example: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @ApiProperty({
    description: 'Additional details about the action',
    example: { oldValue: 'pending', newValue: 'confirmed' },
    required: false,
  })
  @IsOptional()
  @IsObject()
  @Column({ type: 'jsonb', nullable: true })
  details?: Record<string, any>;

  @ApiProperty({
    description: 'Description of the action performed',
    example: 'Updated reservation status from pending to confirmed',
  })
  @IsString()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({
    description: 'Timestamp when the action was performed',
    example: '2024-01-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
