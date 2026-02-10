import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { CleaningAssignment } from '../cleaning-assignments';
import { MaintenanceReport } from '../maintenance-reports';

@Module({
  imports: [TypeOrmModule.forFeature([CleaningAssignment, MaintenanceReport])],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
