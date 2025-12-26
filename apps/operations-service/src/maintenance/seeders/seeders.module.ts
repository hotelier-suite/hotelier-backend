import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneralMaintenanceRequest } from '../entities';
import { MaintenanceSeeder } from './maintenance.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralMaintenanceRequest])],
  providers: [MaintenanceSeeder],
  exports: [MaintenanceSeeder],
})
export class MaintenanceSeedersModule {}
