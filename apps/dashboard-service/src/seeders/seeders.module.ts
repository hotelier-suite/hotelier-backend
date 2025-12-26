import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { WidgetsSeeder } from './domains';
import { DashboardWidget } from '../dashboard';

@Module({
  imports: [TypeOrmModule.forFeature([DashboardWidget])],
  providers: [SeedersService, WidgetsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
