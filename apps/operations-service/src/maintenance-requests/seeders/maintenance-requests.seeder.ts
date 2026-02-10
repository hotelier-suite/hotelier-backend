import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRequest } from '../entities';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class MaintenanceRequestsSeeder {
  constructor(
    @InjectRepository(MaintenanceRequest)
    private readonly maintenanceRequestRepository: Repository<MaintenanceRequest>,
  ) {}

  async seed(): Promise<void> {
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
      await this.maintenanceRequestRepository.save(request);
    }
  }
}
