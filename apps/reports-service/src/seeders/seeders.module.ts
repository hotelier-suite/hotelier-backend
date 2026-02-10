import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { ReportsSeeder, AnalyticsSeeder } from './domains';
import { Report } from '../reports';
import { AnalyticsData } from '../analytics';

@Module({
  imports: [TypeOrmModule.forFeature([Report, AnalyticsData])],
  providers: [SeedersService, ReportsSeeder, AnalyticsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
