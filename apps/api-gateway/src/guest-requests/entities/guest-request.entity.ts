import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  IsDateString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RequestType } from '../enums/request-type.enum';
import { RequestStatus } from '../enums/request-status.enum';
import { RequestPriority } from '../enums/request-priority.enum';

@Entity('guest_requests')
export class GuestRequest {
  @ApiProperty({
    description: 'Guest request unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Room number',
    example: '301',
  })
  @IsString()
  @Length(1, 20)
  @Column()
  room: string;

  @ApiProperty({
    description: 'Guest name',
    example: 'Sarah Johnson',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  guestName: string;

  @ApiProperty({
    description: 'Request type',
    enum: RequestType,
    example: RequestType.TOWELS,
  })
  @IsEnum(RequestType)
  @Column({
    type: 'enum',
    enum: RequestType,
  })
  type: RequestType;

  @ApiProperty({
    description: 'Request description',
    example:
      'Please provide additional bath towels and pool towels for family of 4',
  })
  @IsString()
  @Length(1, 1000)
  @Column()
  description: string;

  @ApiProperty({
    description: 'Request status',
    enum: RequestStatus,
    example: RequestStatus.PENDING,
    required: false,
  })
  @IsOptional()
  @IsEnum(RequestStatus)
  @Column({
    type: 'enum',
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status?: RequestStatus;

  @ApiProperty({
    description: 'Request priority',
    enum: RequestPriority,
    example: RequestPriority.MEDIUM,
    required: false,
  })
  @IsOptional()
  @IsEnum(RequestPriority)
  @Column({
    type: 'enum',
    enum: RequestPriority,
    default: RequestPriority.MEDIUM,
  })
  priority?: RequestPriority;

  @ApiProperty({
    description: 'Request time',
    example: '2024-12-08T14:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  time?: Date;

  @ApiProperty({
    description: 'Request completion time',
    example: '2024-12-08T15:15:00.000Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({
    description: 'Staff member assigned to request',
    example: 'Mary Williams',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  @Column({ nullable: true })
  assignedTo?: string;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Delivered 6 bath towels and 4 pool towels as requested',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  notes?: string;

  @ApiProperty({
    description: 'Request creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Request last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
