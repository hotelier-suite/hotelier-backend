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
  IsNumber,
  IsDateString,
  Length,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MaintenanceStatus } from '../enums/maintenance-status.enum';
import { MaintenancePriority } from '../enums/maintenance-priority.enum';
import { MaintenanceType } from '../enums/maintenance-type.enum';
import { EmployeeDto } from '@app/contracts/staff-service/employees/dto/employee.dto';

@Entity('general_maintenance_requests')
export class GeneralMaintenanceRequest {
  @ApiProperty({
    description: 'Maintenance request unique identifier',
    example: 1,
  })
  @IsInt()
  @Min(1)
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Maintenance request title',
    example: 'Fix air conditioning in room 205',
  })
  @IsString()
  @Length(1, 200)
  @Column()
  title: string;

  @ApiProperty({
    description: 'Detailed description of the maintenance request',
    example:
      'The air conditioning unit is not working properly and making noise.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  description?: string;

  @ApiProperty({
    description: 'Type of maintenance',
    enum: MaintenanceType,
    example: MaintenanceType.CORRECTIVE,
  })
  @IsEnum(MaintenanceType)
  @Column({
    type: 'enum',
    enum: MaintenanceType,
  })
  type: MaintenanceType;

  @ApiProperty({
    description: 'Priority level',
    enum: MaintenancePriority,
    example: MaintenancePriority.HIGH,
  })
  @IsEnum(MaintenancePriority)
  @Column({
    type: 'enum',
    enum: MaintenancePriority,
  })
  priority: MaintenancePriority;

  @ApiProperty({
    description: 'Current status',
    enum: MaintenanceStatus,
    example: MaintenanceStatus.SCHEDULED,
    required: false,
  })
  @IsOptional()
  @IsEnum(MaintenanceStatus)
  @Column({
    type: 'enum',
    enum: MaintenanceStatus,
    default: MaintenanceStatus.SCHEDULED,
  })
  status?: MaintenanceStatus;

  @ApiProperty({
    description: 'Location where maintenance is needed',
    example: 'Room 205',
  })
  @IsString()
  @Length(1, 100)
  @Column()
  location: string;

  @ApiProperty({
    description: 'Equipment or asset requiring maintenance',
    example: 'Air Conditioning Unit',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 100)
  @Column({ nullable: true })
  equipment?: string;

  @ApiProperty({
    description: 'Scheduled date for maintenance',
    example: '2024-12-15',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  @Type(() => Date)
  @Column({ type: 'date', nullable: true })
  scheduledDate?: Date;

  @ApiProperty({
    description: 'Scheduled start time',
    example: '09:00',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 20)
  @Column({ nullable: true })
  scheduledStartTime?: string;

  @ApiProperty({
    description: 'Estimated duration in hours',
    example: 2.5,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  estimatedDuration?: number;

  @ApiProperty({
    description: 'Estimated cost for maintenance',
    example: 150.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @ApiProperty({
    description: 'Actual cost for maintenance',
    example: 175.0,
    minimum: 0,
    required: false,
  })
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  actualCost?: number;

  @ApiProperty({
    description: 'ID of the assigned technician',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ nullable: true })
  assignedTechnicianId?: number;

  @ApiProperty({
    description: 'Assigned technician details',
    type: () => EmployeeDto,
    required: false,
  })
  assignedTechnician?: EmployeeDto;

  @ApiProperty({
    description: 'ID of the employee who requested maintenance',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Column({ nullable: true })
  requestedById?: number;

  @ApiProperty({
    description: 'Employee who requested maintenance',
    type: () => EmployeeDto,
    required: false,
  })
  requestedBy?: EmployeeDto;

  @ApiProperty({
    description: 'Date when maintenance was started',
    example: '2024-12-15T09:00:00.000Z',
    required: false,
  })
  @IsOptional()
  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @ApiProperty({
    description: 'Date when maintenance was completed',
    example: '2024-12-15T11:30:00.000Z',
    required: false,
  })
  @IsOptional()
  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @ApiProperty({
    description: 'Work performed or completion notes',
    example: 'Replaced faulty compressor and cleaned filters.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 1000)
  @Column({ type: 'text', nullable: true })
  workPerformed?: string;

  @ApiProperty({
    description: 'Materials used during maintenance',
    example: 'Compressor unit, air filters, refrigerant',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(0, 500)
  @Column({ type: 'text', nullable: true })
  materialsUsed?: string;

  @ApiProperty({
    description: 'Maintenance request creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Maintenance request last update timestamp',
    example: '2024-01-15T14:20:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
