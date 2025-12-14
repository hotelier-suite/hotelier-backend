import { PartialType } from '@nestjs/swagger';
import { CreateMaintenanceReportDto } from './create-maintenance-report.dto';
import { MaintenanceStatus } from '../enums/maintenance-status.enum';

export class UpdateMaintenanceReportDto extends PartialType(
  CreateMaintenanceReportDto,
) {
  status?: MaintenanceStatus;
  assignedTechnician?: string;
  startedAt?: Date;
  completedAt?: Date;
  cost?: number;
  notes?: string;
}
