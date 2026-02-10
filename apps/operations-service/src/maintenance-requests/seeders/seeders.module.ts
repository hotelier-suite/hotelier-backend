import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceRequest } from '../entities';
import { MaintenanceRequestsSeeder } from './maintenance-requests.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([MaintenanceRequest])],
  providers: [MaintenanceRequestsSeeder],
  exports: [MaintenanceRequestsSeeder],
})
export class MaintenanceRequestsSeedersModule {}
