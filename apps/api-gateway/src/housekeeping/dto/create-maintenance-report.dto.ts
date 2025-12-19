import { OmitType } from '@nestjs/swagger';
import { MaintenanceReport } from '../entities/maintenance-report.entity';

export class CreateMaintenanceReportDto extends OmitType(MaintenanceReport, [
  'id',
  'reportNumber',
  'status',
  'startedAt',
  'completedAt',
  'cost',
  'notes',
  'createdAt',
  'updatedAt',
  'room',
]) {}
