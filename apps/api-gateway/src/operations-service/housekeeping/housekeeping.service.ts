import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';
import {
  HOUSEKEEPING_PATTERNS,
  CleaningTaskDto,
  CreateCleaningTaskDto,
  UpdateCleaningTaskDto,
  CleaningAssignmentDto,
  CreateCleaningAssignmentDto,
  UpdateCleaningAssignmentDto,
  MaintenanceReportDto,
  CreateMaintenanceReportDto,
  UpdateMaintenanceReportDto,
  HousekeepingMaintenanceRequestDto,
  CreateHousekeepingMaintenanceRequestDto,
  UpdateHousekeepingMaintenanceRequestDto,
  HousekeepingStatisticsDto,
  CleaningPerformanceDto,
} from '@app/contracts/operations-service';

@Injectable()
export class HousekeepingService {
  constructor(
    @Inject(OPERATIONS_SERVICE_CLIENT)
    private readonly operationsClient: ClientProxy,
  ) {}

  // Cleaning Tasks
  findAllTasks(): Observable<CleaningTaskDto[]> {
    return this.operationsClient.send<CleaningTaskDto[], Record<string, never>>(
      HOUSEKEEPING_PATTERNS.FIND_ALL_TASKS,
      {},
    );
  }

  findOneTask(id: number): Observable<CleaningTaskDto> {
    return this.operationsClient.send<CleaningTaskDto, number>(
      HOUSEKEEPING_PATTERNS.FIND_ONE_TASK,
      id,
    );
  }

  createTask(data: CreateCleaningTaskDto): Observable<CleaningTaskDto> {
    return this.operationsClient.send<CleaningTaskDto, CreateCleaningTaskDto>(
      HOUSEKEEPING_PATTERNS.CREATE_TASK,
      data,
    );
  }

  updateTask(
    id: number,
    data: UpdateCleaningTaskDto,
  ): Observable<CleaningTaskDto> {
    return this.operationsClient.send<
      CleaningTaskDto,
      { id: number; data: UpdateCleaningTaskDto }
    >(HOUSEKEEPING_PATTERNS.UPDATE_TASK, { id, data });
  }

  deleteTask(id: number): Observable<CleaningTaskDto> {
    return this.operationsClient.send<CleaningTaskDto, number>(
      HOUSEKEEPING_PATTERNS.DELETE_TASK,
      id,
    );
  }

  // Cleaning Assignments
  findAllAssignments(): Observable<CleaningAssignmentDto[]> {
    return this.operationsClient.send<
      CleaningAssignmentDto[],
      Record<string, never>
    >(HOUSEKEEPING_PATTERNS.FIND_ALL_ASSIGNMENTS, {});
  }

  findOneAssignment(id: number): Observable<CleaningAssignmentDto> {
    return this.operationsClient.send<CleaningAssignmentDto, number>(
      HOUSEKEEPING_PATTERNS.FIND_ONE_ASSIGNMENT,
      id,
    );
  }

  createAssignment(
    data: CreateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.operationsClient.send<
      CleaningAssignmentDto,
      CreateCleaningAssignmentDto
    >(HOUSEKEEPING_PATTERNS.CREATE_ASSIGNMENT, data);
  }

  updateAssignment(
    id: number,
    data: UpdateCleaningAssignmentDto,
  ): Observable<CleaningAssignmentDto> {
    return this.operationsClient.send<
      CleaningAssignmentDto,
      { id: number; data: UpdateCleaningAssignmentDto }
    >(HOUSEKEEPING_PATTERNS.UPDATE_ASSIGNMENT, { id, data });
  }

  deleteAssignment(id: number): Observable<CleaningAssignmentDto> {
    return this.operationsClient.send<CleaningAssignmentDto, number>(
      HOUSEKEEPING_PATTERNS.DELETE_ASSIGNMENT,
      id,
    );
  }

  // Maintenance Reports
  findAllMaintenanceReports(): Observable<MaintenanceReportDto[]> {
    return this.operationsClient.send<
      MaintenanceReportDto[],
      Record<string, never>
    >(HOUSEKEEPING_PATTERNS.FIND_ALL_MAINTENANCE_REPORTS, {});
  }

  findOneMaintenanceReport(id: number): Observable<MaintenanceReportDto> {
    return this.operationsClient.send<MaintenanceReportDto, number>(
      HOUSEKEEPING_PATTERNS.FIND_ONE_MAINTENANCE_REPORT,
      id,
    );
  }

  createMaintenanceReport(
    data: CreateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.operationsClient.send<
      MaintenanceReportDto,
      CreateMaintenanceReportDto
    >(HOUSEKEEPING_PATTERNS.CREATE_MAINTENANCE_REPORT, data);
  }

  updateMaintenanceReport(
    id: number,
    data: UpdateMaintenanceReportDto,
  ): Observable<MaintenanceReportDto> {
    return this.operationsClient.send<
      MaintenanceReportDto,
      { id: number; data: UpdateMaintenanceReportDto }
    >(HOUSEKEEPING_PATTERNS.UPDATE_MAINTENANCE_REPORT, { id, data });
  }

  deleteMaintenanceReport(id: number): Observable<MaintenanceReportDto> {
    return this.operationsClient.send<MaintenanceReportDto, number>(
      HOUSEKEEPING_PATTERNS.DELETE_MAINTENANCE_REPORT,
      id,
    );
  }

  // Maintenance Requests
  findAllMaintenanceRequests(): Observable<
    HousekeepingMaintenanceRequestDto[]
  > {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto[],
      Record<string, never>
    >(HOUSEKEEPING_PATTERNS.FIND_ALL_MAINTENANCE_REQUESTS, {});
  }

  findOneMaintenanceRequest(
    id: number,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto,
      number
    >(HOUSEKEEPING_PATTERNS.FIND_ONE_MAINTENANCE_REQUEST, id);
  }

  createMaintenanceRequest(
    data: CreateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto,
      CreateHousekeepingMaintenanceRequestDto
    >(HOUSEKEEPING_PATTERNS.CREATE_MAINTENANCE_REQUEST, data);
  }

  updateMaintenanceRequest(
    id: number,
    data: UpdateHousekeepingMaintenanceRequestDto,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto,
      { id: number; data: UpdateHousekeepingMaintenanceRequestDto }
    >(HOUSEKEEPING_PATTERNS.UPDATE_MAINTENANCE_REQUEST, { id, data });
  }

  deleteMaintenanceRequest(
    id: number,
  ): Observable<HousekeepingMaintenanceRequestDto> {
    return this.operationsClient.send<
      HousekeepingMaintenanceRequestDto,
      number
    >(HOUSEKEEPING_PATTERNS.DELETE_MAINTENANCE_REQUEST, id);
  }

  // Statistics
  getStatistics(): Observable<HousekeepingStatisticsDto> {
    return this.operationsClient.send<
      HousekeepingStatisticsDto,
      Record<string, never>
    >(HOUSEKEEPING_PATTERNS.GET_STATISTICS, {});
  }

  getCleaningPerformance(
    employeeId?: number,
  ): Observable<CleaningPerformanceDto> {
    return this.operationsClient.send<
      CleaningPerformanceDto,
      number | undefined
    >(HOUSEKEEPING_PATTERNS.GET_CLEANING_PERFORMANCE, employeeId);
  }
}
