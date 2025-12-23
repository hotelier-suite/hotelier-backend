import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CleaningTask } from '../entities/cleaning-task.entity';
import { CleaningAssignment } from '../entities/cleaning-assignment.entity';
import { MaintenanceReport } from '../entities/maintenance-report.entity';
import { MaintenanceRequest } from '../entities/maintenance-request.entity';
import { HousekeepingSeeder } from './housekeeping.seeder';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CleaningTask,
      CleaningAssignment,
      MaintenanceReport,
      MaintenanceRequest,
    ]),
  ],
  providers: [HousekeepingSeeder],
  exports: [HousekeepingSeeder],
})
export class HousekeepingSeedersModule {}
