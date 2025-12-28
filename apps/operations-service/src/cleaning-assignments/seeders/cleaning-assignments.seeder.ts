import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningAssignment } from '../entities';
import { CleaningStatus } from '@app/contracts/operations-service';

@Injectable()
export class CleaningAssignmentsSeeder {
  constructor(
    @InjectRepository(CleaningAssignment)
    private readonly cleaningAssignmentRepository: Repository<CleaningAssignment>,
  ) {}

  async seed(): Promise<void> {
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
      await this.cleaningAssignmentRepository.save(assignment);
    }
  }
}
