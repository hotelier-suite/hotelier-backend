import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CleaningTask } from './entities/cleaning-task.entity';
import { CleaningAssignment } from './entities/cleaning-assignment.entity';
import { MaintenanceReport } from './entities/maintenance-report.entity';
import { MaintenanceRequest } from './entities/maintenance-request.entity';
import { CleaningTaskDto, CreateCleaningTaskDto, UpdateCleaningTaskDto } from '@app/contracts/operations-service/housekeeping/dto';
import { CleaningAssignmentDto, CreateCleaningAssignmentDto, UpdateCleaningAssignmentDto } from '@app/contracts/operations-service/housekeeping/dto';
import { MaintenanceReportDto, CreateMaintenanceReportDto, UpdateMaintenanceReportDto } from '@app/contracts/operations-service/housekeeping/dto';
import { HousekeepingMaintenanceRequestDto, CreateHousekeepingMaintenanceRequestDto, UpdateHousekeepingMaintenanceRequestDto } from '@app/contracts/operations-service/housekeeping/dto';
import { HousekeepingStatisticsDto, CleaningPerformanceDto } from '@app/contracts/operations-service/housekeeping/dto';
import { CleaningStatus, HousekeepingMaintenanceStatus, TaskPriority } from '@app/contracts/operations-service/housekeeping/enums';

@Injectable()
export class HousekeepingService {
  constructor(
    @InjectRepository(CleaningTask)
    private readonly cleaningTaskRepository: Repository<CleaningTask>,
    @InjectRepository(CleaningAssignment)
    private readonly cleaningAssignmentRepository: Repository<CleaningAssignment>,
    @InjectRepository(MaintenanceReport)
    private readonly maintenanceReportRepository: Repository<MaintenanceReport>,
    @InjectRepository(MaintenanceRequest)
    private readonly maintenanceRequestRepository: Repository<MaintenanceRequest>,
  ) {}

  // Cleaning Tasks
  async findAllTasks(): Promise<CleaningTaskDto[]> {
    return this.cleaningTaskRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneTask(id: number): Promise<CleaningTaskDto> {
    const task = await this.cleaningTaskRepository.findOne({ where: { id } });
    if (!task) {
      throw new RpcException({ statusCode: 404, message: `Cleaning task with id ${id} not found` });
    }
    return task;
  }

  async createTask(data: CreateCleaningTaskDto): Promise<CleaningTaskDto> {
    const task = this.cleaningTaskRepository.create({
      ...data,
      status: CleaningStatus.PENDING,
      priority: data.priority ?? TaskPriority.NORMAL,
    });
    return this.cleaningTaskRepository.save(task);
  }

  async updateTask(id: number, data: UpdateCleaningTaskDto): Promise<CleaningTaskDto> {
    await this.findOneTask(id);
    await this.cleaningTaskRepository.update(id, data);
    return this.findOneTask(id);
  }

  async deleteTask(id: number): Promise<CleaningTaskDto> {
    const task = await this.findOneTask(id);
    await this.cleaningTaskRepository.remove(task as CleaningTask);
    return task;
  }

  // Cleaning Assignments
  async findAllAssignments(): Promise<CleaningAssignmentDto[]> {
    return this.cleaningAssignmentRepository.find({ order: { assignedDate: 'DESC' } });
  }

  async findOneAssignment(id: number): Promise<CleaningAssignmentDto> {
    const assignment = await this.cleaningAssignmentRepository.findOne({ where: { id } });
    if (!assignment) {
      throw new RpcException({ statusCode: 404, message: `Cleaning assignment with id ${id} not found` });
    }
    return assignment;
  }

  async createAssignment(data: CreateCleaningAssignmentDto): Promise<CleaningAssignmentDto> {
    const assignment = this.cleaningAssignmentRepository.create({
      ...data,
      status: CleaningStatus.PENDING,
    });
    return this.cleaningAssignmentRepository.save(assignment);
  }

  async updateAssignment(id: number, data: UpdateCleaningAssignmentDto): Promise<CleaningAssignmentDto> {
    await this.findOneAssignment(id);
    await this.cleaningAssignmentRepository.update(id, data);
    return this.findOneAssignment(id);
  }

  async deleteAssignment(id: number): Promise<CleaningAssignmentDto> {
    const assignment = await this.findOneAssignment(id);
    await this.cleaningAssignmentRepository.remove(assignment as CleaningAssignment);
    return assignment;
  }


  // Maintenance Reports
  async findAllMaintenanceReports(): Promise<MaintenanceReportDto[]> {
    return this.maintenanceReportRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneMaintenanceReport(id: number): Promise<MaintenanceReportDto> {
    const report = await this.maintenanceReportRepository.findOne({ where: { id } });
    if (!report) {
      throw new RpcException({ statusCode: 404, message: `Maintenance report with id ${id} not found` });
    }
    return report;
  }

  async createMaintenanceReport(data: CreateMaintenanceReportDto): Promise<MaintenanceReportDto> {
    const report = this.maintenanceReportRepository.create({
      ...data,
      reportNumber: `MR-${Date.now()}`,
      status: HousekeepingMaintenanceStatus.PENDING,
      priority: data.priority ?? TaskPriority.NORMAL,
    });
    return this.maintenanceReportRepository.save(report);
  }

  async updateMaintenanceReport(id: number, data: UpdateMaintenanceReportDto): Promise<MaintenanceReportDto> {
    await this.findOneMaintenanceReport(id);
    await this.maintenanceReportRepository.update(id, data);
    return this.findOneMaintenanceReport(id);
  }

  async deleteMaintenanceReport(id: number): Promise<MaintenanceReportDto> {
    const report = await this.findOneMaintenanceReport(id);
    await this.maintenanceReportRepository.remove(report as MaintenanceReport);
    return report;
  }

  // Maintenance Requests
  async findAllMaintenanceRequests(): Promise<HousekeepingMaintenanceRequestDto[]> {
    return this.maintenanceRequestRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findOneMaintenanceRequest(id: number): Promise<HousekeepingMaintenanceRequestDto> {
    const request = await this.maintenanceRequestRepository.findOne({ where: { id } });
    if (!request) {
      throw new RpcException({ statusCode: 404, message: `Maintenance request with id ${id} not found` });
    }
    return request;
  }

  async createMaintenanceRequest(data: CreateHousekeepingMaintenanceRequestDto): Promise<HousekeepingMaintenanceRequestDto> {
    const request = this.maintenanceRequestRepository.create({
      ...data,
      status: HousekeepingMaintenanceStatus.PENDING,
      priority: data.priority ?? TaskPriority.NORMAL,
      reportDate: new Date(),
    });
    return this.maintenanceRequestRepository.save(request);
  }

  async updateMaintenanceRequest(id: number, data: UpdateHousekeepingMaintenanceRequestDto): Promise<HousekeepingMaintenanceRequestDto> {
    await this.findOneMaintenanceRequest(id);
    await this.maintenanceRequestRepository.update(id, data);
    return this.findOneMaintenanceRequest(id);
  }

  async deleteMaintenanceRequest(id: number): Promise<HousekeepingMaintenanceRequestDto> {
    const request = await this.findOneMaintenanceRequest(id);
    await this.maintenanceRequestRepository.remove(request as MaintenanceRequest);
    return request;
  }

  // Statistics
  async getStatistics(): Promise<HousekeepingStatisticsDto> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      pendingMaintenance,
      inProgressMaintenance,
      completedMaintenance,
      pendingCleaning,
      inProgressCleaning,
      completedCleaning,
      todaysMaintenance,
      todaysCleaning,
    ] = await Promise.all([
      this.maintenanceReportRepository.count({ where: { status: HousekeepingMaintenanceStatus.PENDING } }),
      this.maintenanceReportRepository.count({ where: { status: HousekeepingMaintenanceStatus.IN_PROGRESS } }),
      this.maintenanceReportRepository.count({ where: { status: HousekeepingMaintenanceStatus.COMPLETED } }),
      this.cleaningAssignmentRepository.count({ where: { status: CleaningStatus.PENDING } }),
      this.cleaningAssignmentRepository.count({ where: { status: CleaningStatus.IN_PROGRESS } }),
      this.cleaningAssignmentRepository.count({ where: { status: CleaningStatus.COMPLETED } }),
      this.maintenanceReportRepository.find({ where: { createdAt: Between(today, tomorrow) }, order: { createdAt: 'DESC' } }),
      this.cleaningAssignmentRepository.find({ where: { assignedDate: Between(today, tomorrow) }, order: { assignedDate: 'ASC' } }),
    ]);

    return {
      pendingMaintenanceReports: pendingMaintenance,
      inProgressMaintenanceReports: inProgressMaintenance,
      completedMaintenanceReports: completedMaintenance,
      pendingCleaningAssignments: pendingCleaning,
      inProgressCleaningAssignments: inProgressCleaning,
      completedCleaningAssignments: completedCleaning,
      todaysMaintenanceReports: todaysMaintenance,
      todaysCleaningAssignments: todaysCleaning,
    };
  }

  async getCleaningPerformance(employeeId?: number): Promise<CleaningPerformanceDto> {
    const whereClause = employeeId
      ? { status: CleaningStatus.COMPLETED, employeeId }
      : { status: CleaningStatus.COMPLETED };

    const assignments = await this.cleaningAssignmentRepository.find({ where: whereClause });
    const totalAssignments = await this.cleaningAssignmentRepository.count();
    const completionRate = totalAssignments > 0 ? (assignments.length / totalAssignments) * 100 : 0;

    const totalQuality = assignments.reduce((sum, a) => sum + (a.qualityScore || 0), 0);
    const averageQualityScore = assignments.length > 0 ? totalQuality / assignments.length : 0;

    const employeeStats: Record<number, { count: number; totalScore: number }> = {};
    for (const assignment of assignments) {
      const empId = assignment.employeeId;
      if (typeof empId !== 'number') continue;
      if (!employeeStats[empId]) employeeStats[empId] = { count: 0, totalScore: 0 };
      employeeStats[empId].count += 1;
      employeeStats[empId].totalScore += assignment.qualityScore || 0;
    }

    const employeePerformance = Object.entries(employeeStats).map(([id, stats]) => ({
      employeeId: parseInt(id),
      completedAssignments: stats.count,
      averageQualityScore: stats.count > 0 ? stats.totalScore / stats.count : 0,
    }));

    return { averageQualityScore, completionRate, employeePerformance };
  }
}
