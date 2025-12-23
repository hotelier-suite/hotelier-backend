import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningTask } from '../entities/cleaning-task.entity';
import { CleaningAssignment } from '../entities/cleaning-assignment.entity';
import { MaintenanceReport } from '../entities/maintenance-report.entity';
import { MaintenanceRequest } from '../entities/maintenance-request.entity';
import { CleaningStatus } from '@app/contracts/operations-service/housekeeping/enums/cleaning-status.enum';
import { TaskPriority } from '@app/contracts/operations-service/housekeeping/enums/task-priority.enum';
import { HousekeepingMaintenanceType } from '@app/contracts/operations-service/housekeeping/enums/maintenance-type.enum';
import { HousekeepingMaintenanceStatus } from '@app/contracts/operations-service/housekeeping/enums/maintenance-status.enum';

@Injectable()
export class HousekeepingSeeder {
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

  async seed(): Promise<void> {
    await this.seedCleaningTasks();
    await this.seedCleaningAssignments();
    await this.seedMaintenanceReports();
    await this.seedMaintenanceRequests();
  }

  private async seedCleaningTasks(): Promise<void> {
    const count = await this.cleaningTaskRepository.count();
    if (count > 0) return;

    const tasks = [
      {
        roomNumber: '101',
        roomId: 1,
        priority: TaskPriority.NORMAL,
        assignedEmployee: 'Maria Garcia',
        notes: 'Standard cleaning',
      },
      {
        roomNumber: '102',
        roomId: 2,
        priority: TaskPriority.HIGH,
        assignedEmployee: 'Juan Lopez',
        notes: 'Deep cleaning required',
      },
      {
        roomNumber: '201',
        roomId: 3,
        priority: TaskPriority.URGENT,
        assignedEmployee: 'Ana Martinez',
        notes: 'VIP guest arriving',
      },
      {
        roomNumber: '202',
        roomId: 4,
        priority: TaskPriority.LOW,
        notes: 'Routine maintenance check',
      },
      {
        roomNumber: '301',
        roomId: 5,
        priority: TaskPriority.NORMAL,
        assignedEmployee: 'Carlos Rodriguez',
        status: CleaningStatus.IN_PROGRESS,
      },
    ];

    for (const task of tasks) {
      await this.cleaningTaskRepository.save({
        ...task,
        status: task.status ?? CleaningStatus.PENDING,
      });
    }
  }

  private async seedCleaningAssignments(): Promise<void> {
    const count = await this.cleaningAssignmentRepository.count();
    if (count > 0) return;

    const assignments = [
      { roomId: 1, employeeId: 1, notes: 'Morning shift cleaning' },
      {
        roomId: 2,
        employeeId: 2,
        notes: 'Checkout cleaning',
        status: CleaningStatus.COMPLETED,
        qualityScore: 9.5,
      },
      {
        roomId: 3,
        employeeId: 1,
        notes: 'VIP preparation',
        status: CleaningStatus.IN_PROGRESS,
      },
      { roomId: 4, employeeId: 3, notes: 'Standard cleaning' },
      {
        roomId: 5,
        employeeId: 2,
        notes: 'Deep cleaning',
        status: CleaningStatus.COMPLETED,
        qualityScore: 8.7,
      },
    ];

    for (const assignment of assignments) {
      await this.cleaningAssignmentRepository.save({
        ...assignment,
        status: assignment.status ?? CleaningStatus.PENDING,
        assignedDate: new Date(),
      });
    }
  }

  private async seedMaintenanceReports(): Promise<void> {
    const count = await this.maintenanceReportRepository.count();
    if (count > 0) return;

    const reports = [
      {
        reportNumber: 'MR-001',
        type: HousekeepingMaintenanceType.PLUMBING,
        description: 'Leaky faucet in bathroom',
        reportedBy: 'Maria Garcia',
        roomId: 1,
        priority: TaskPriority.HIGH,
      },
      {
        reportNumber: 'MR-002',
        type: HousekeepingMaintenanceType.ELECTRICAL,
        description: 'Light fixture not working',
        reportedBy: 'Juan Lopez',
        roomId: 2,
        priority: TaskPriority.NORMAL,
      },
      {
        reportNumber: 'MR-003',
        type: HousekeepingMaintenanceType.HVAC,
        description: 'AC not cooling properly',
        reportedBy: 'Ana Martinez',
        roomId: 3,
        priority: TaskPriority.URGENT,
        status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      },
      {
        reportNumber: 'MR-004',
        type: HousekeepingMaintenanceType.FURNITURE,
        description: 'Broken chair leg',
        reportedBy: 'Carlos Rodriguez',
        roomId: 4,
        priority: TaskPriority.LOW,
      },
      {
        reportNumber: 'MR-005',
        type: HousekeepingMaintenanceType.APPLIANCES,
        description: 'Mini fridge not working',
        reportedBy: 'Maria Garcia',
        roomId: 5,
        priority: TaskPriority.NORMAL,
        status: HousekeepingMaintenanceStatus.COMPLETED,
      },
    ];

    for (const report of reports) {
      await this.maintenanceReportRepository.save({
        ...report,
        status: report.status ?? HousekeepingMaintenanceStatus.PENDING,
      });
    }
  }

  private async seedMaintenanceRequests(): Promise<void> {
    const count = await this.maintenanceRequestRepository.count();
    if (count > 0) return;

    const requests = [
      {
        roomNumber: '101',
        roomId: 1,
        type: HousekeepingMaintenanceType.PLUMBING,
        description: 'Toilet running constantly',
        reportedBy: 'Guest',
        priority: TaskPriority.HIGH,
      },
      {
        roomNumber: '203',
        roomId: 6,
        type: HousekeepingMaintenanceType.ELECTRICAL,
        description: 'Power outlet not working',
        reportedBy: 'Housekeeping',
        priority: TaskPriority.NORMAL,
      },
      {
        roomNumber: '305',
        roomId: 7,
        type: HousekeepingMaintenanceType.HVAC,
        description: 'Heating not working',
        reportedBy: 'Guest',
        priority: TaskPriority.URGENT,
        status: HousekeepingMaintenanceStatus.IN_PROGRESS,
        assignedTo: 'Luis Fernandez',
      },
    ];

    for (const request of requests) {
      await this.maintenanceRequestRepository.save({
        ...request,
        status: request.status ?? HousekeepingMaintenanceStatus.PENDING,
        reportDate: new Date(),
      });
    }
  }
}
