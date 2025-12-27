import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';
import {
  MAINTENANCE_REPORTS_PATTERNS,
  MaintenanceReportDto,
  CreateMaintenanceReportDto,
  UpdateMaintenanceReportDto,
} from '@app/contracts/operations-service';

@Injectable()
export class MaintenanceReportsService {
  constructor(
    @Inject(OPERATIONS_SERVICE_CLIENT)
    private readonly operationsClient: ClientProxy,
  ) {}

  findAll(): Observable<MaintenanceReportDto[]> {
    return this.operationsClient.send<
      MaintenanceReportDto[],
      Record<string, never>
    >(MAINTENANCE_REPORTS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<MaintenanceReportDto> {
    return this.operationsClient.send<MaintenanceReportDto, number>(
      MAINTENANCE_REPORTS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateMaintenanceReportDto): Observable<MaintenanceReportDto> {
    return this.operationsClient.send<
      MaintenanceReportDto,
      CreateMaintenanceReportDto
    >(MAINTENANCE_REPORTS_PATTERNS.CREATE, data);
  }

  update(
    id: number,
    data: UpdateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.operationsClient.send<
      MaintenanceReportDto,
      { id: number; data: UpdateMaintenanceReportDto }
    >(MAINTENANCE_REPORTS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<MaintenanceReportDto> {
    return this.operationsClient.send<MaintenanceReportDto, number>(
      MAINTENANCE_REPORTS_PATTERNS.DELETE,
      id,
    );
  }
}
