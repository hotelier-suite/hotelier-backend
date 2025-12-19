import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningTask } from '../../entities/cleaning-task.entity';
import { Room } from '../../../rooms/entities/room.entity';
import { CleaningStatus } from '../../enums/cleaning-status.enum';
import { TaskPriority } from '../../enums/task-priority.enum';

@Injectable()
export class CleaningTasksSeeder {
  constructor(
    @InjectRepository(CleaningTask)
    private cleaningTaskRepository: Repository<CleaningTask>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async seed() {
    const rooms = await this.roomRepository.find({ take: 5 });

    if (rooms.length === 0) {
      console.log('Skipping cleaning task seeds - no rooms found');
      return;
    }

    const cleaningTasks = [
      {
        roomNumber: rooms[0].number,
        status: CleaningStatus.COMPLETED,
        assignedEmployee: 'Mary Johnson',
        notes: 'Regular cleaning completed. Room ready for next guest.',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        estimatedTime: 45,
        priority: TaskPriority.NORMAL,
        roomId: rooms[0].id,
      },
      {
        roomNumber: rooms[1].number,
        status: CleaningStatus.IN_PROGRESS,
        assignedEmployee: 'Emily Brown',
        notes: 'Deep cleaning in progress.',
        startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        estimatedTime: 60,
        priority: TaskPriority.HIGH,
        roomId: rooms[1].id,
      },
      {
        roomNumber: rooms[2].number,
        status: CleaningStatus.PENDING,
        assignedEmployee: 'James Smith',
        notes: 'Checkout cleaning required.',
        estimatedTime: 45,
        priority: TaskPriority.NORMAL,
        roomId: rooms[2].id,
      },
      {
        roomNumber: rooms[3].number,
        status: CleaningStatus.NEEDS_MAINTENANCE,
        assignedEmployee: 'Mary Johnson',
        notes: 'Air conditioning not working properly. Maintenance required.',
        startTime: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        estimatedTime: 30,
        priority: TaskPriority.URGENT,
        roomId: rooms[3].id,
      },
      {
        roomNumber: rooms[4].number,
        status: CleaningStatus.INSPECTED,
        assignedEmployee: 'Emily Brown',
        notes: 'Cleaning completed and inspected. Quality score: 9.5/10',
        startTime: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        endTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        estimatedTime: 50,
        priority: TaskPriority.NORMAL,
        roomId: rooms[4].id,
      },
    ];

    for (const taskData of cleaningTasks) {
      const existingTask = await this.cleaningTaskRepository.findOne({
        where: { roomNumber: taskData.roomNumber, status: taskData.status },
      });

      if (!existingTask) {
        await this.cleaningTaskRepository.save(taskData);
      }
    }
  }
}
