import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { HousekeepingMaintenanceType } from '../enums/maintenance-type.enum';
import { TaskPriority } from '../enums/task-priority.enum';

export class CreateMaintenanceReportDto {
  @ApiProperty({
    description: 'Type of maintenance required',
    enum: HousekeepingMaintenanceType,
    example: HousekeepingMaintenanceType.PLUMBING,
  })
  @IsEnum(HousekeepingMaintenanceType)
  type: HousekeepingMaintenanceType;

  @ApiProperty({
    description: 'Detailed description of the maintenance issue',
    example: 'Bathroom faucet leaking, needs immediate attention',
  })
  @IsString()
  @Length(1, 500)
  description: string;

  @ApiProperty({
    description: 'Priority level of the maintenance task',
    enum: TaskPriority,
    example: TaskPriority.NORMAL,
    required: false,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiProperty({
    description: 'Name of the technician assigned to this maintenance',
    example: 'Luis Fernandez',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  assignedTechnician?: string;

  @ApiProperty({
    description: 'Name of the person who reported the issue',
    example: 'Mary Johnson',
  })
  @IsString()
  @Length(1, 100)
  reportedBy: string;

  @ApiProperty({
    description: 'Estimated time to complete the maintenance',
    example: '2 hours',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(1, 100)
  estimatedTime?: string;

  @ApiProperty({
    description: 'ID of the room where maintenance is required',
    example: 101,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  roomId?: number;
}
