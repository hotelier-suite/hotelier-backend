import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum NotificationType {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ALERT = 'ALERT',
}

@Entity('notifications')
export class Notification {
  @ApiProperty({ description: 'Notification ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Notification type', enum: NotificationType })
  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type: NotificationType;

  @ApiProperty({ description: 'Short title' })
  @Column({ length: 150 })
  title: string;

  @ApiProperty({ description: 'Detailed message' })
  @Column({ type: 'text' })
  message: string;

  @ApiProperty({
    description: 'Optional resource reference (e.g., inventory item id)',
    required: false,
  })
  @Column({ nullable: true })
  refId?: number;

  @ApiProperty({
    description: 'Optional resource type (e.g., inventory)',
    required: false,
  })
  @Column({ nullable: true, length: 50 })
  refType?: string;

  @ApiProperty({ description: 'Whether the notification has been read' })
  @Index()
  @Column({ default: false })
  isRead: boolean;

  @ApiProperty({
    description:
      'User ID to whom the notification is addressed (null = broadcast)',
    required: false,
  })
  @Index()
  @Column({ type: 'int', nullable: true })
  userId?: number | null;

  @ApiProperty({ description: 'Created at' })
  @CreateDateColumn()
  createdAt: Date;
}
