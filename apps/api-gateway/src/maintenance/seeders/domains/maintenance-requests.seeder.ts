import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GeneralMaintenanceRequest } from '../../entities/maintenance-request.entity';
import { MaintenanceType } from '../../enums/maintenance-type.enum';
import { MaintenancePriority } from '../../enums/maintenance-priority.enum';
import { MaintenanceStatus } from '../../enums/maintenance-status.enum';

@Injectable()
export class MaintenanceRequestSeeder {
  constructor(
    @InjectRepository(GeneralMaintenanceRequest)
    private maintenanceRequestRepository: Repository<GeneralMaintenanceRequest>,
  ) {}

  async seed() {
    // Create some basic maintenance records
    const requests = [
      this.maintenanceRequestRepository.create({
        title: 'Air Conditioning System Repair - Room 301',
        description:
          'The air conditioning in room 301 is not cooling properly. Guests have complained about the high temperature.',
        type: MaintenanceType.CORRECTIVE,
        priority: MaintenancePriority.HIGH,
        status: MaintenanceStatus.SCHEDULED,
        location: 'Room 301 - Floor 3',
        equipment: 'Samsung AR24 Air Conditioning Unit',
        scheduledDate: new Date('2024-12-08'),
        scheduledStartTime: '09:00',
        estimatedDuration: 120,
        estimatedCost: 250.0,
      }),
      this.maintenanceRequestRepository.create({
        title: 'Monthly Electrical System Inspection - Main Lobby',
        description:
          'Scheduled inspection of the main lobby electrical system to ensure safety and optimal operation.',
        type: MaintenanceType.PREVENTIVE,
        priority: MaintenancePriority.MEDIUM,
        status: MaintenanceStatus.COMPLETED,
        location: 'Main Lobby - Ground Floor',
        equipment: 'Main Electrical Panel PE-001',
        scheduledDate: new Date('2024-12-01'),
        scheduledStartTime: '06:00',
        estimatedDuration: 180,
        estimatedCost: 300.0,
        workPerformed:
          'Complete electrical panel inspection, contact cleaning, voltage and current verification.',
        materialsUsed: '20A fuse, contact cleaner, insulation tape',
        startedAt: new Date('2024-12-01T06:00:00'),
        completedAt: new Date('2024-12-01T08:30:00'),
        actualCost: 285.0,
      }),
      this.maintenanceRequestRepository.create({
        title: 'Water Leak - Room 205 Bathroom',
        description: 'Water leak reported in room 205 bathroom.',
        type: MaintenanceType.EMERGENCY,
        priority: MaintenancePriority.CRITICAL,
        status: MaintenanceStatus.IN_PROGRESS,
        location: 'Room 205 - Floor 2',
        equipment: 'Main Bathroom Pipe',
        scheduledDate: new Date('2024-12-07'),
        scheduledStartTime: '14:30',
        estimatedDuration: 240,
        estimatedCost: 450.0,
        workPerformed: 'Leak located at pipe joint. Repair in progress.',
        materialsUsed: '1/2" PVC pipe, elbows, PVC cement',
        startedAt: new Date('2024-12-07T14:30:00'),
      }),
      this.maintenanceRequestRepository.create({
        title: 'Preventive Maintenance Main Elevator',
        description:
          'Quarterly scheduled maintenance of the hotel main elevator.',
        type: MaintenanceType.PREVENTIVE,
        priority: MaintenancePriority.HIGH,
        status: MaintenanceStatus.SCHEDULED,
        location: 'Main Elevator - All Floors',
        equipment: 'Otis Gen2-MRL Elevator',
        scheduledDate: new Date('2024-12-10'),
        scheduledStartTime: '05:00',
        estimatedDuration: 360,
        estimatedCost: 800.0,
      }),
      this.maintenanceRequestRepository.create({
        title: 'LED Lighting Upgrade - Floor 4 Hallway',
        description: 'Lighting system upgrade for the floor 4 hallway.',
        type: MaintenanceType.UPGRADE,
        priority: MaintenancePriority.LOW,
        status: MaintenanceStatus.SCHEDULED,
        location: 'Main Hallway - Floor 4',
        equipment: 'Hallway Fixtures',
        scheduledDate: new Date('2024-12-12'),
        scheduledStartTime: '10:00',
        estimatedDuration: 480,
        estimatedCost: 1200.0,
      }),
    ];

    await this.maintenanceRequestRepository.save(requests);
  }
}
