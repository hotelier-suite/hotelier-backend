import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
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
import { IncidentType } from '@app/contracts/parking-service/incidents/enums/incident-type.enum';
import { IncidentStatus } from '@app/contracts/parking-service/incidents/enums/incident-status.enum';
import { TaskPriority } from '@app/contracts/common/enums/task-priority.enum';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ParkingSpace } from '../../spaces/entities/parking-space.entity';

@Entity('parking_incidents')
export class ParkingIncident {
  @ApiProperty({ description: 'Incident unique identifier', example: 1 })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Type of incident',
    enum: IncidentType,
    example: IncidentType.VEHICLE_DAMAGE,
  })
  @IsEnum(IncidentType)
  @Column({
    type: 'enum',
    enum: IncidentType,
  })
  type: IncidentType;

  @ApiProperty({
    description: 'Detailed description of the incident',
    example: 'Minor scratch on rear bumper',
  })
  @IsString()
  @Length(1, 500)
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ description: 'Date and time when incident was reported' })
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  reportDate: Date;

  @ApiProperty({
    description: 'Current status of the incident',
    enum: IncidentStatus,
    example: IncidentStatus.PENDING,
    required: false,
  })
  @IsEnum(IncidentStatus)
  @Column({
    type: 'enum',
    enum: IncidentStatus,
    default: IncidentStatus.PENDING,
  })
  status: IncidentStatus;

  @ApiProperty({
    description: 'Person or team responsible for handling the incident',
    example: 'Security Team',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  responsible: string;

  @ApiProperty({
    description: 'Priority level of the incident',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
    required: false,
  })
  @IsEnum(TaskPriority)
  @Column({
    type: 'enum',
    enum: TaskPriority,
    default: TaskPriority.NORMAL,
  })
  priority: TaskPriority;

  @ApiProperty({
    description: 'Resolution details when incident is resolved',
    example: 'Incident documented, vehicle owner notified',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 1000)
  @Column({ type: 'text', nullable: true })
  resolution?: string;

  @ApiProperty({
    description: 'Date and time when incident was resolved',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @ApiProperty({ description: 'Record creation timestamp' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Record last update timestamp' })
  @UpdateDateColumn()
  updatedAt: Date;

  // Foreign keys
  @ApiProperty({
    description: 'ID of the related vehicle',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ nullable: true })
  vehicleId?: number;

  @ApiProperty({
    description: 'ID of the related parking space',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ nullable: true })
  spaceId?: number;

  // Relations
  @ApiProperty({
    description: 'Related vehicle',
    type: () => Vehicle,
    required: false,
  })
  @ManyToOne(() => Vehicle, (vehicle) => vehicle.incidents, { nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle?: Vehicle;

  @ApiProperty({
    description: 'Related parking space',
    type: () => ParkingSpace,
    required: false,
  })
  @ManyToOne(() => ParkingSpace, (space) => space.incidents, { nullable: true })
  @JoinColumn({ name: 'spaceId' })
  space?: ParkingSpace;
}
