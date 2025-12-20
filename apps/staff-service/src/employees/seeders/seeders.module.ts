import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../entities/employee.entity';
import { EmployeesSeeder } from './employees.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  providers: [EmployeesSeeder],
  exports: [EmployeesSeeder],
})
export class EmployeesSeedersModule {}
