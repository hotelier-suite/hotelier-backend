import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { CleaningTasksSeedersModule } from '../cleaning-tasks';
import { CleaningAssignmentsSeedersModule } from '../cleaning-assignments';
import { MaintenanceReportsSeedersModule } from '../maintenance-reports';
import { MaintenanceRequestsSeedersModule } from '../maintenance-requests';
import { MaintenanceSeedersModule } from '../maintenance';

@Module({
  imports: [
    CleaningTasksSeedersModule,
    CleaningAssignmentsSeedersModule,
    MaintenanceReportsSeedersModule,
    MaintenanceRequestsSeedersModule,
    MaintenanceSeedersModule,
  ],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
