import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceReport } from '../entities';
import { MaintenanceReportsSeeder } from './maintenance-reports.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceReport])],
  providers: [MaintenanceReportsSeeder],
  exports: [MaintenanceReportsSeeder],
})
export class MaintenanceReportsSeedersModule {}
