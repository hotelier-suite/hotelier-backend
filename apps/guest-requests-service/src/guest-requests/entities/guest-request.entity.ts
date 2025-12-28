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
import {
  GuestRequestType,
  GuestRequestStatus,
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

  @IsEnum(GuestRequestType)
  @Column({
    type: 'enum',
    enum: GuestRequestType,
  })
  type: GuestRequestType;

  @IsString()
  @Length(1, 1000)
  @Column()
  description: string;

  @IsOptional()
  @IsEnum(GuestRequestStatus)
  @Column({
    type: 'enum',
    enum: GuestRequestStatus,
    default: GuestRequestStatus.PENDING,
  })
  status?: GuestRequestStatus;

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
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time?: Date;

  @IsOptional()
  @IsDate()
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
