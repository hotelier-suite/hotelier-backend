import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  CleaningTask,
  CleaningAssignment,
  MaintenanceReport,
  MaintenanceRequest,
} from '../entities';
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
