import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from './entities/attendance.entity';
import { Employee } from '../employees/entities/employee.entity';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Employee]), SeedersModule],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService, SeedersModule],
})
export class AttendanceModule {}
