import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from '../entities/shift.entity';
import { Employee } from '../../employees/entities/employee.entity';
import { ShiftsSeeder } from './shifts.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Employee])],
  providers: [ShiftsSeeder],
  exports: [ShiftsSeeder],
})
export class ShiftsSeedersModule {}
