import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousekeepingController } from './housekeeping.controller';
import { HousekeepingService } from './housekeeping.service';
import { CleaningTask } from './entities/cleaning-task.entity';
import { CleaningAssignment } from './entities/cleaning-assignment.entity';
import { MaintenanceReport } from './entities/maintenance-report.entity';
import { MaintenanceRequest } from './entities/maintenance-request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CleaningTask,
      CleaningAssignment,
      MaintenanceReport,
      MaintenanceRequest,
    ]),
  ],
  controllers: [HousekeepingController],
  providers: [HousekeepingService],
  exports: [HousekeepingService],
})
export class HousekeepingModule {}
