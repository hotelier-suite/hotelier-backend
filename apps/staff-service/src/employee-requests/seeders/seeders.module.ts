import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRequest } from '../entities/employee-request.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { EmployeeRequestsSeeder } from './employee-requests.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRequest, Employee])],
  providers: [EmployeeRequestsSeeder],
  exports: [EmployeeRequestsSeeder],
})
export class EmployeeRequestsSeedersModule {}
