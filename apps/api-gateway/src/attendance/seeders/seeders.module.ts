import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { AttendanceSeeder } from './domains/attendance.seeder';
import { Attendance } from '../entities/attendance.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attendance, Employee])],
  providers: [SeedersService, AttendanceSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
