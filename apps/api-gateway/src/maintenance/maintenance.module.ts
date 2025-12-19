import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { GeneralMaintenanceRequest } from './entities/maintenance-request.entity';
import { Employee } from '../employees/entities/employee.entity';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneralMaintenanceRequest, Employee]),
    SeedersModule,
  ],
  controllers: [MaintenanceController],
  providers: [MaintenanceService],
  exports: [MaintenanceService, SeedersModule],
})
export class MaintenanceModule {}
