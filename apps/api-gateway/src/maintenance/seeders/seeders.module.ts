import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { MaintenanceRequestSeeder } from './domains/maintenance-requests.seeder';
import { GeneralMaintenanceRequest } from '../entities/maintenance-request.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GeneralMaintenanceRequest, Employee])],
  providers: [SeedersService, MaintenanceRequestSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
