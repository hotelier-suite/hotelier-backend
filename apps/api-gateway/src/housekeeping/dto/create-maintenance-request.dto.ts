import { OmitType } from '@nestjs/swagger';
import { MaintenanceRequest } from '../entities/maintenance-request.entity';

export class CreateMaintenanceRequestDto extends OmitType(MaintenanceRequest, [
  'id',
  'status',
  'assignedTo',
  'reportDate',
  'resolvedDate',
  'cost',
  'notes',
  'createdAt',
  'updatedAt',
  'room',
]) {}
