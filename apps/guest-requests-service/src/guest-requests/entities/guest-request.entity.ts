import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsDate,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  RequestType,
  RequestStatus,
  RequestPriority,
} from '@app/contracts/guest-requests-service';

@Entity('guest_requests')
export class GuestRequest {
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @Length(1, 20)
  @Column()
  room: string;

  @IsString()
  @Length(1, 100)
  @Column()
  guestName: string;

  @IsEnum(RequestType)
  @Column({
    type: 'enum',
    enum: RequestType,
  })
  type: RequestType;

  @IsString()
  @Length(1, 1000)
  @Column()
  description: string;

  @IsOptional()
  @IsEnum(RequestStatus)
  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status?: RequestStatus;

  @IsOptional()
  @IsEnum(RequestPriority)
  @Column({
    type: 'enum',
    enum: RequestPriority,
    default: RequestPriority.MEDIUM,
  })
  priority?: RequestPriority;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  assignedTo?: string;

  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
