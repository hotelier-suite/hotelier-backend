import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { ReportsSeeder } from './domains/reports.seeder';
import { AnalyticsSeeder } from './domains/analytics.seeder';
import { Report } from '../reports/entities/report.entity';
import { AnalyticsData } from '../analytics/entities/analytics-data.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, AnalyticsData])],
  providers: [SeedersService, ReportsSeeder, AnalyticsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
