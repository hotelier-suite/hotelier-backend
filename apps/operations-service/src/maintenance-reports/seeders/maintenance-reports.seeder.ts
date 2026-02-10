import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceReport } from '../entities';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class MaintenanceReportsSeeder {
  constructor(
    @InjectRepository(MaintenanceReport)
    private readonly maintenanceReportRepository: Repository<MaintenanceReport>,
  ) {}

  async seed(): Promise<void> {
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
      await this.maintenanceReportRepository.save(report);
    }
  }
}
