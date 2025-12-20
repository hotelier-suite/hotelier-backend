import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../entities/attendance.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { AttendanceSeeder } from './attendance.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Employee])],
  providers: [AttendanceSeeder],
  exports: [AttendanceSeeder],
})
export class AttendanceSeedersModule {}
