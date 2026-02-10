import { Module } from '@nestjs/common';
import { EmployeeRequestsController } from './employee-requests.controller';
import { EmployeeRequestsService } from './employee-requests.service';

@Module({
  controllers: [EmployeeRequestsController],
  providers: [EmployeeRequestsService],
  exports: [EmployeeRequestsService],
})
export class EmployeeRequestsModule {}
