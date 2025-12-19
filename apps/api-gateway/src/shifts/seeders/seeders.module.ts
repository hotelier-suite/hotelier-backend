import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { ShiftsSeeder } from './domains/shifts.seeder';
import { Shift } from '../entities/shift.entity';
import { Employee } from '../../employees/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Employee])],
  providers: [SeedersService, ShiftsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
