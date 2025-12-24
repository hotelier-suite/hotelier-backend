import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { WidgetsSeeder } from './domains/widgets.seeder';
import { DashboardWidget } from '../dashboard/entities/dashboard-widget.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardWidget])],
  providers: [SeedersService, WidgetsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
