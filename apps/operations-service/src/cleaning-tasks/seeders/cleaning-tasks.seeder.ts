import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningTask } from '../entities';
import { CleaningStatus } from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

@Injectable()
export class CleaningTasksSeeder {
  constructor(
    @InjectRepository(CleaningTask)
    private readonly cleaningTaskRepository: Repository<CleaningTask>,
  ) {}

  async seed(): Promise<void> {
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
      await this.cleaningTaskRepository.save(task);
    }
  }
}
