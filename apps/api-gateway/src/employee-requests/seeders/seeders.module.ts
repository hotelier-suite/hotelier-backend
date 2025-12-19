import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { EmployeeRequestsSeeder } from './domains/employee-requests.seeder';
import { EmployeeRequest } from '../entities/employee-request.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRequest, Employee])],
  providers: [SeedersService, EmployeeRequestsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
