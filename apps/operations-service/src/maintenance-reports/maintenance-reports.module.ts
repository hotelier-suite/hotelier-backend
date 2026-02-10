import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceReportsController } from './maintenance-reports.controller';
import { MaintenanceReportsService } from './maintenance-reports.service';
import { MaintenanceReport } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceReport])],
  controllers: [MaintenanceReportsController],
  providers: [MaintenanceReportsService],
  exports: [MaintenanceReportsService],
})
export class MaintenanceReportsModule {}
