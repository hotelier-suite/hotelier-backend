import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MaintenanceReportsService } from './maintenance-reports.service';
import {
  MAINTENANCE_REPORTS_PATTERNS,
  MaintenanceReportDto,
  CreateMaintenanceReportDto,
  UpdateMaintenanceReportDto,
} from '@app/contracts/operations-service';

@Controller()
export class MaintenanceReportsController {
  constructor(
    private readonly maintenanceReportsService: MaintenanceReportsService,
  ) {}

  @MessagePattern(MAINTENANCE_REPORTS_PATTERNS.FIND_ALL)
  findAll(): Promise<MaintenanceReportDto[]> {
    return this.maintenanceReportsService.findAll();
  }

  @MessagePattern(MAINTENANCE_REPORTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<MaintenanceReportDto> {
    return this.maintenanceReportsService.findOne(id);
  }

  @MessagePattern(MAINTENANCE_REPORTS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateMaintenanceReportDto,
  ): Promise<MaintenanceReportDto> {
    return this.maintenanceReportsService.create(data);
  }

  @MessagePattern(MAINTENANCE_REPORTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateMaintenanceReportDto },
  ): Promise<MaintenanceReportDto> {
    return this.maintenanceReportsService.update(payload.id, payload.data);
  }

  @MessagePattern(MAINTENANCE_REPORTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<MaintenanceReportDto> {
    return this.maintenanceReportsService.remove(id);
  }
}
