import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralMaintenanceRequest } from '../entities';
import {
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
} from '@app/contracts/operations-service';

@Injectable()
export class MaintenanceSeeder {
  constructor(
    @InjectRepository(GeneralMaintenanceRequest)
    private readonly maintenanceRequestRepository: Repository<GeneralMaintenanceRequest>,
  ) {}

  async seed(): Promise<void> {
    const count = await this.maintenanceRequestRepository.count();
    if (count > 0) return;

    const requests = [
      {
        title: 'Fix air conditioning in room 205',
        description:
          'The air conditioning unit is not working properly and making noise.',
        type: MaintenanceType.CORRECTIVE,
        priority: MaintenancePriority.HIGH,
        location: 'Room 205',
        equipment: 'Air Conditioning Unit',
        scheduledDate: new Date(),
        estimatedDuration: 2.5,
        estimatedCost: 150.0,
      },
      {
        title: 'Monthly elevator inspection',
        description: 'Routine monthly inspection of all elevators.',
        type: MaintenanceType.INSPECTION,
        priority: MaintenancePriority.MEDIUM,
        location: 'Main Building',
        equipment: 'Elevators',
        scheduledDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedDuration: 4.0,
        estimatedCost: 500.0,
      },
      {
        title: 'Replace lobby lighting',
        description: 'Upgrade lobby lighting to LED fixtures.',
        type: MaintenanceType.UPGRADE,
        priority: MaintenancePriority.LOW,
        location: 'Main Lobby',
        equipment: 'Lighting System',
        scheduledDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estimatedDuration: 8.0,
        estimatedCost: 2000.0,
      },
      {
        title: 'Emergency plumbing repair',
        description: 'Water leak in basement storage area.',
        type: MaintenanceType.EMERGENCY,
        priority: MaintenancePriority.CRITICAL,
        location: 'Basement Storage',
        equipment: 'Plumbing',
        status: MaintenanceStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      {
        title: 'HVAC filter replacement',
        description: 'Quarterly HVAC filter replacement for all floors.',
        type: MaintenanceType.PREVENTIVE,
        priority: MaintenancePriority.MEDIUM,
        location: 'All Floors',
        equipment: 'HVAC System',
        scheduledDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        estimatedDuration: 6.0,
        estimatedCost: 800.0,
      },
    ];

    for (const request of requests) {
      await this.maintenanceRequestRepository.save({
        ...request,
        status: request.status ?? MaintenanceStatus.SCHEDULED,
      });
    }
  }
}
