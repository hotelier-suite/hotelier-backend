import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { MaintenanceType } from '../enums/maintenance-type.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class CreateIncidentReportDto {
  @ApiProperty({
    description: 'Room number where the incident occurred',
    example: '101',
  })
  @IsString()
  roomNumber: string;

  @ApiProperty({
    description: 'Type of incident/maintenance required',
    enum: MaintenanceType,
    example: MaintenanceType.PLUMBING,
  })
  @IsEnum(MaintenanceType)
  type: MaintenanceType;

  @ApiProperty({
    description: 'Priority level of the incident',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
  })
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @ApiProperty({
    description: 'Detailed description of the incident',
    example: 'Bathroom faucet is leaking and needs immediate repair',
  })
  @IsString()
  description: string;

  @ApiProperty({
    description: 'Person who reported the incident',
    example: 'Housekeeping Staff',
    required: false,
  })
  @IsOptional()
  @IsString()
  reportedBy?: string;
}
