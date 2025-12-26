import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../entities';
import { Employee } from '../../employees';
import { AttendanceSeeder } from './attendance.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Employee])],
  providers: [AttendanceSeeder],
  exports: [AttendanceSeeder],
})
export class AttendanceSeedersModule {}
