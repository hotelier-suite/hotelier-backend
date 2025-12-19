import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee } from './entities/employee.entity';
import { Staff } from './entities/staff.entity';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Staff]), SeedersModule],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService, SeedersModule],
})
export class EmployeesModule {}
