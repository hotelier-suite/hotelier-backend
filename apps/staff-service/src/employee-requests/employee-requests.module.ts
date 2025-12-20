import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeRequest } from './entities/employee-request.entity';
import { Employee } from '../employees/entities/employee.entity';
import { EmployeeRequestsController } from './employee-requests.controller';
import { EmployeeRequestsService } from './employee-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeRequest, Employee])],
  controllers: [EmployeeRequestsController],
  providers: [EmployeeRequestsService],
  exports: [EmployeeRequestsService],
})
export class EmployeeRequestsModule {}
