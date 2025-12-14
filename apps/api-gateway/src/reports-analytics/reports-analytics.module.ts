import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsAnalyticsService } from './reports-analytics.service';
import { ReportsAnalyticsController } from './reports-analytics.controller';
import { AnalyticsData } from './entities/analytics-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AnalyticsData])],
  controllers: [ReportsAnalyticsController],
  providers: [ReportsAnalyticsService],
  exports: [ReportsAnalyticsService],
})
export class ReportsAnalyticsModule {}
