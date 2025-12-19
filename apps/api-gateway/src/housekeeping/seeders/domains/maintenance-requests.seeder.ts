import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaintenanceRequest } from '../../entities/maintenance-request.entity';
import { Room } from '../../../rooms/entities/room.entity';
import { MaintenanceType } from '../../enums/maintenance-type.enum';
import { MaintenanceStatus } from '../../enums/maintenance-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';

@Injectable()
export class MaintenanceRequestsSeeder {
  constructor(
    @InjectRepository(MaintenanceRequest)
    private requestRepository: Repository<MaintenanceRequest>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async seed() {
    const rooms = await this.roomRepository.find({ take: 4 });

    if (rooms.length === 0) {
      console.log('Skipping maintenance request seeds - no rooms found');
      return;
    }

    const requests = [
      {
        roomNumber: rooms[0].number,
        type: MaintenanceType.PLUMBING,
        description: 'Bathroom faucet leaking, needs immediate attention',
        priority: TaskPriority.HIGH,
        status: MaintenanceStatus.PENDING,
        reportedBy: 'Mary Johnson',
        assignedTo: 'Luis Fernandez',
        reportDate: new Date(),
        cost: 45.5,
        notes: 'Guest complaint received this morning',
        roomId: rooms[0].id,
      },
      {
        roomNumber: rooms[1].number,
        type: MaintenanceType.HVAC,
        description: 'Air conditioning not cooling properly',
        priority: TaskPriority.URGENT,
        status: MaintenanceStatus.IN_PROGRESS,
        reportedBy: 'James Smith',
        assignedTo: 'David Reynolds',
        reportDate: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        notes: 'Filter replacement needed',
        roomId: rooms[1].id,
      },
      {
        roomNumber: rooms[2].number,
        type: MaintenanceType.ELECTRICAL,
        description: 'Lamp in reading area not working',
        priority: TaskPriority.NORMAL,
        status: MaintenanceStatus.COMPLETED,
        reportedBy: 'Emily Brown',
        assignedTo: 'Luis Fernandez',
        reportDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        resolvedDate: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
        cost: 25.0,
        notes: 'Bulb replaced and wiring checked',
        roomId: rooms[2].id,
      },
      {
        roomNumber: rooms[3].number,
        type: MaintenanceType.FURNITURE,
        description: 'Chair leg wobbling, safety concern',
        priority: TaskPriority.HIGH,
        status: MaintenanceStatus.PENDING,
        reportedBy: 'Amanda Davis',
        reportDate: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        notes: 'Guest reported during checkout',
        roomId: rooms[3].id,
      },
    ];

    for (const requestData of requests) {
      const existing = await this.requestRepository.findOne({
        where: {
          roomNumber: requestData.roomNumber,
          type: requestData.type,
          description: requestData.description,
        },
      });

      if (!existing) {
        await this.requestRepository.save(requestData);
      }
    }
  }
}
