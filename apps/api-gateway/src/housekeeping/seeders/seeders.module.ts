import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { CleaningTasksSeeder } from './domains/cleaning-tasks.seeder';
import { CleaningAssignmentsSeeder } from './domains/cleaning-assignments.seeder';
import { MaintenanceRequestsSeeder } from './domains/maintenance-requests.seeder';
import { MaintenanceReportsSeeder } from './domains/maintenance-reports.seeder';
import { CleaningTask } from '../entities/cleaning-task.entity';
import { CleaningAssignment } from '../entities/cleaning-assignment.entity';
import { MaintenanceRequest } from '../entities/maintenance-request.entity';
import { MaintenanceReport } from '../entities/maintenance-report.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Staff } from '../../employees/entities/staff.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CleaningTask,
      CleaningAssignment,
      MaintenanceRequest,
      MaintenanceReport,
      Room,
      Staff,
    ]),
  ],
  providers: [
    SeedersService,
    CleaningTasksSeeder,
    CleaningAssignmentsSeeder,
    MaintenanceRequestsSeeder,
    MaintenanceReportsSeeder,
  ],
  exports: [SeedersService],
})
export class SeedersModule {}
