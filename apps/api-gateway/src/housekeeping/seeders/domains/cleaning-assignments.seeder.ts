import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CleaningAssignment } from '../../entities/cleaning-assignment.entity';
import { Staff } from '../../../employees/entities/staff.entity';
import { Room } from '../../../rooms/entities/room.entity';
import { CleaningStatus } from '../../enums/cleaning-status.enum';
import { Department } from '../../../employees/enums/department.enum';

@Injectable()
export class CleaningAssignmentsSeeder {
  constructor(
    @InjectRepository(CleaningAssignment)
    private assignmentRepository: Repository<CleaningAssignment>,
    @InjectRepository(Staff)
    private staffRepository: Repository<Staff>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async seed() {
    const housekeepingStaff = await this.staffRepository.find({
      where: { department: Department.HOUSEKEEPING },
      take: 3,
    });
    const rooms = await this.roomRepository.find({ take: 6 });

    if (housekeepingStaff.length === 0 || rooms.length === 0) {
      console.log(
        'Skipping cleaning assignment seeds - insufficient staff or rooms',
      );
      return;
    }

    const assignments = [
      {
        assignedDate: new Date(),
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        status: CleaningStatus.COMPLETED,
        notes: 'Regular maintenance cleaning completed successfully',
        qualityScore: 9.5,
        employeeId: housekeepingStaff[0].id,
        roomId: rooms[0].id,
      },
      {
        assignedDate: new Date(),
        startedAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        status: CleaningStatus.IN_PROGRESS,
        notes: 'Deep cleaning in progress - guest checkout',
        employeeId: housekeepingStaff[1]?.id || housekeepingStaff[0].id,
        roomId: rooms[1].id,
      },
      {
        assignedDate: new Date(),
        status: CleaningStatus.PENDING,
        notes: 'Scheduled for morning shift',
        employeeId: housekeepingStaff[2]?.id || housekeepingStaff[0].id,
        roomId: rooms[2].id,
      },
      {
        assignedDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        startedAt: new Date(Date.now() - 23 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 22 * 60 * 60 * 1000),
        status: CleaningStatus.INSPECTED,
        notes: 'Quality inspection passed with excellent rating',
        qualityScore: 9.8,
        employeeId: housekeepingStaff[0].id,
        roomId: rooms[3].id,
      },
      {
        assignedDate: new Date(),
        startedAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        status: CleaningStatus.NEEDS_MAINTENANCE,
        notes: 'Found plumbing issue - maintenance team notified',
        employeeId: housekeepingStaff[1]?.id || housekeepingStaff[0].id,
        roomId: rooms[4].id,
      },
    ];

    for (const assignmentData of assignments) {
      const existing = await this.assignmentRepository.findOne({
        where: {
          employeeId: assignmentData.employeeId,
          roomId: assignmentData.roomId,
          status: assignmentData.status,
        },
      });

      if (!existing) {
        await this.assignmentRepository.save(assignmentData);
      }
    }
  }
}
