import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceReport } from '../../entities/maintenance-report.entity';
import { Room } from '../../../rooms/entities/room.entity';
import { MaintenanceType } from '../../enums/maintenance-type.enum';
import { MaintenanceStatus } from '../../enums/maintenance-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';

@Injectable()
export class MaintenanceReportsSeeder {
  constructor(
    @InjectRepository(MaintenanceReport)
    private reportRepository: Repository<MaintenanceReport>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async seed() {
    const rooms = await this.roomRepository.find({ take: 3 });

    if (rooms.length === 0) {
      console.log('Skipping maintenance report seeds - no rooms found');
      return;
    }

    const reports = [
      {
        reportNumber: 'MR-2024-001',
        type: MaintenanceType.HVAC,
        description: 'Monthly HVAC system inspection and filter replacement',
        priority: TaskPriority.NORMAL,
        status: MaintenanceStatus.COMPLETED,
        assignedTechnician: 'David Reynolds',
        reportedBy: 'Maintenance Department',
        estimatedTime: '2 hours',
        startedAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
        completedAt: new Date(Date.now() - 23 * 60 * 60 * 1000), // 23 hours ago
        cost: 150.0,
        notes: 'All filters replaced, system running optimally',
        roomId: rooms[0].id,
      },
      {
        reportNumber: 'MR-2024-002',
        type: MaintenanceType.PLUMBING,
        description: 'Emergency repair of burst pipe in bathroom',
        priority: TaskPriority.URGENT,
        status: MaintenanceStatus.COMPLETED,
        assignedTechnician: 'Luis Fernandez',
        reportedBy: 'Front Desk',
        estimatedTime: '4 hours',
        startedAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        cost: 275.5,
        notes: 'Pipe replaced, water damage minimal, room ready for use',
        roomId: rooms[1].id,
      },
      {
        reportNumber: 'MR-2024-003',
        type: MaintenanceType.ELECTRICAL,
        description: 'Installation of new LED lighting system',
        priority: TaskPriority.LOW,
        status: MaintenanceStatus.IN_PROGRESS,
        assignedTechnician: 'David Reynolds',
        reportedBy: 'Management',
        estimatedTime: '6 hours',
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        cost: 320.0,
        notes: 'Energy-efficient upgrade in progress',
        roomId: rooms[2].id,
      },
      {
        reportNumber: 'MR-2024-004',
        type: MaintenanceType.COSMETIC,
        description: 'Room painting and wall touch-ups',
        priority: TaskPriority.NORMAL,
        status: MaintenanceStatus.PENDING,
        reportedBy: 'Housekeeping',
        estimatedTime: '1 day',
        notes: 'Scheduled for next week when room is vacant',
      },
    ];

    for (const reportData of reports) {
      const existing = await this.reportRepository.findOne({
        where: { reportNumber: reportData.reportNumber },
      });

      if (!existing) {
        await this.reportRepository.save(reportData);
      }
    }
  }
}
