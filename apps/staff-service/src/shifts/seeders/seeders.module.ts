import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Shift } from '../entities';
import { Employee } from '../../employees';
import { ShiftsSeeder } from './shifts.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Shift, Employee])],
  providers: [ShiftsSeeder],
  exports: [ShiftsSeeder],
})
export class ShiftsSeedersModule {}
