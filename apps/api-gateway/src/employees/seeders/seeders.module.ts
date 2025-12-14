import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { EmployeesSeeder } from './domains/employees.seeder';
import { StaffSeeder } from './domains/staff.seeder';
import { Employee } from '../entities/employee.entity';
import { Staff } from '../entities/staff.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee, Staff])],
  providers: [SeedersService, EmployeesSeeder, StaffSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
