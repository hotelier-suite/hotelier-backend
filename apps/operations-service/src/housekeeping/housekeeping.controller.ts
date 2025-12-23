import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { HOUSEKEEPING_PATTERNS } from '@app/contracts/operations-service/housekeeping/housekeeping.patterns';
import {
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
} from '@app/contracts/operations-service/housekeeping/dto';
import { HousekeepingService } from './housekeeping.service';

@Controller()
export class HousekeepingController {
  constructor(private readonly housekeepingService: HousekeepingService) {}

  // Cleaning Tasks
  @MessagePattern(HOUSEKEEPING_PATTERNS.FIND_ALL_TASKS)
  findAllTasks(): Promise<CleaningTaskDto[]> {
    return this.housekeepingService.findAllTasks();
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.FIND_ONE_TASK)
  findOneTask(@Payload() id: number): Promise<CleaningTaskDto> {
    return this.housekeepingService.findOneTask(id);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.CREATE_TASK)
  createTask(@Payload() data: CreateCleaningTaskDto): Promise<CleaningTaskDto> {
    return this.housekeepingService.createTask(data);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.UPDATE_TASK)
  updateTask(
    @Payload() payload: { id: number; data: UpdateCleaningTaskDto },
  ): Promise<CleaningTaskDto> {
    return this.housekeepingService.updateTask(payload.id, payload.data);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.DELETE_TASK)
  deleteTask(@Payload() id: number): Promise<CleaningTaskDto> {
    return this.housekeepingService.deleteTask(id);
  }

  // Cleaning Assignments
  @MessagePattern(HOUSEKEEPING_PATTERNS.FIND_ALL_ASSIGNMENTS)
  findAllAssignments(): Promise<CleaningAssignmentDto[]> {
    return this.housekeepingService.findAllAssignments();
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.FIND_ONE_ASSIGNMENT)
  findOneAssignment(@Payload() id: number): Promise<CleaningAssignmentDto> {
    return this.housekeepingService.findOneAssignment(id);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.CREATE_ASSIGNMENT)
  createAssignment(
    @Payload() data: CreateCleaningAssignmentDto,
  ): Promise<CleaningAssignmentDto> {
    return this.housekeepingService.createAssignment(data);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.UPDATE_ASSIGNMENT)
  updateAssignment(
    @Payload() payload: { id: number; data: UpdateCleaningAssignmentDto },
  ): Promise<CleaningAssignmentDto> {
    return this.housekeepingService.updateAssignment(payload.id, payload.data);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.DELETE_ASSIGNMENT)
  deleteAssignment(@Payload() id: number): Promise<CleaningAssignmentDto> {
    return this.housekeepingService.deleteAssignment(id);
  }

  // Maintenance Reports
  @MessagePattern(HOUSEKEEPING_PATTERNS.FIND_ALL_MAINTENANCE_REPORTS)
  findAllMaintenanceReports(): Promise<MaintenanceReportDto[]> {
    return this.housekeepingService.findAllMaintenanceReports();
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.FIND_ONE_MAINTENANCE_REPORT)
  findOneMaintenanceReport(
    @Payload() id: number,
  ): Promise<MaintenanceReportDto> {
    return this.housekeepingService.findOneMaintenanceReport(id);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.CREATE_MAINTENANCE_REPORT)
  createMaintenanceReport(
    @Payload() data: CreateMaintenanceReportDto,
  ): Promise<MaintenanceReportDto> {
    return this.housekeepingService.createMaintenanceReport(data);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.UPDATE_MAINTENANCE_REPORT)
  updateMaintenanceReport(
    @Payload() payload: { id: number; data: UpdateMaintenanceReportDto },
  ): Promise<MaintenanceReportDto> {
    return this.housekeepingService.updateMaintenanceReport(
      payload.id,
      payload.data,
    );
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.DELETE_MAINTENANCE_REPORT)
  deleteMaintenanceReport(
    @Payload() id: number,
  ): Promise<MaintenanceReportDto> {
    return this.housekeepingService.deleteMaintenanceReport(id);
  }

  // Maintenance Requests
  @MessagePattern(HOUSEKEEPING_PATTERNS.FIND_ALL_MAINTENANCE_REQUESTS)
  findAllMaintenanceRequests(): Promise<HousekeepingMaintenanceRequestDto[]> {
    return this.housekeepingService.findAllMaintenanceRequests();
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.FIND_ONE_MAINTENANCE_REQUEST)
  findOneMaintenanceRequest(
    @Payload() id: number,
  ): Promise<HousekeepingMaintenanceRequestDto> {
    return this.housekeepingService.findOneMaintenanceRequest(id);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.CREATE_MAINTENANCE_REQUEST)
  createMaintenanceRequest(
    @Payload() data: CreateHousekeepingMaintenanceRequestDto,
  ): Promise<HousekeepingMaintenanceRequestDto> {
    return this.housekeepingService.createMaintenanceRequest(data);
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.UPDATE_MAINTENANCE_REQUEST)
  updateMaintenanceRequest(
    @Payload()
    payload: {
      id: number;
      data: UpdateHousekeepingMaintenanceRequestDto;
    },
  ): Promise<HousekeepingMaintenanceRequestDto> {
    return this.housekeepingService.updateMaintenanceRequest(
      payload.id,
      payload.data,
    );
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.DELETE_MAINTENANCE_REQUEST)
  deleteMaintenanceRequest(
    @Payload() id: number,
  ): Promise<HousekeepingMaintenanceRequestDto> {
    return this.housekeepingService.deleteMaintenanceRequest(id);
  }

  // Statistics
  @MessagePattern(HOUSEKEEPING_PATTERNS.GET_STATISTICS)
  getStatistics(): Promise<HousekeepingStatisticsDto> {
    return this.housekeepingService.getStatistics();
  }

  @MessagePattern(HOUSEKEEPING_PATTERNS.GET_CLEANING_PERFORMANCE)
  getCleaningPerformance(
    @Payload() employeeId?: number,
  ): Promise<CleaningPerformanceDto> {
    return this.housekeepingService.getCleaningPerformance(employeeId);
  }
}
