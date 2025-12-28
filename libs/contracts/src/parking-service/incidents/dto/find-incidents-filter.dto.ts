import { IsOptional, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IncidentStatus } from '../enums/incident-status.enum';
import { IncidentType } from '../enums/incident-type.enum';
import { TaskPriority } from '../../../common';

export class FindIncidentsFilterDto {
  @ApiPropertyOptional({
    description: 'Filter incidents by their current status',
    enum: IncidentStatus,
    example: IncidentStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiPropertyOptional({
    description: 'Filter incidents by their priority level',
    enum: TaskPriority,
    example: TaskPriority.HIGH,
  })
  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @ApiPropertyOptional({
    description: 'Filter incidents by their type',
    enum: IncidentType,
    example: IncidentType.VEHICLE_DAMAGE,
  })
  @IsOptional()
  @IsEnum(IncidentType)
  type?: IncidentType;
}
