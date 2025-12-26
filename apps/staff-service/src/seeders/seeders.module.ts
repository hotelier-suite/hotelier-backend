import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { EmployeesSeedersModule } from '../employees';
import { ShiftsSeedersModule } from '../shifts';
import { AttendanceSeedersModule } from '../attendance';
import { EmployeeRequestsSeedersModule } from '../employee-requests';

@Module({
  imports: [
    EmployeesSeedersModule,
    ShiftsSeedersModule,
    AttendanceSeedersModule,
    EmployeeRequestsSeedersModule,
  ],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
