import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRequestsService } from './employee-requests.service';
import { EmployeeRequestsController } from './employee-requests.controller';
import { EmployeeRequest } from './entities/employee-request.entity';
import { Employee } from '../employees/entities/employee.entity';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([EmployeeRequest, Employee]),
    SeedersModule,
  ],
  controllers: [EmployeeRequestsController],
  providers: [EmployeeRequestsService],
  exports: [EmployeeRequestsService, SeedersModule],
})
export class EmployeeRequestsModule {}
