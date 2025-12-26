import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HousekeepingController } from './housekeeping.controller';
import { HousekeepingService } from './housekeeping.service';
import { CleaningTask } from './entities';
import { CleaningAssignment } from './entities';
import { MaintenanceReport } from './entities';
import { MaintenanceRequest } from './entities';

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
