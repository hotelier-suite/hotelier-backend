import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { MaintenanceRequestSeeder } from './domains/maintenance-requests.seeder';
import { GeneralMaintenanceRequest } from '../entities/maintenance-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralMaintenanceRequest])],
  providers: [SeedersService, MaintenanceRequestSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
