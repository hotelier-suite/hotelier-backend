import { Module } from '@nestjs/common';
import { MaintenanceReportsController } from './maintenance-reports.controller';
import { MaintenanceReportsService } from './maintenance-reports.service';

@Module({
  controllers: [MaintenanceReportsController],
  providers: [MaintenanceReportsService],
  exports: [MaintenanceReportsService],
})
export class MaintenanceReportsModule {}
