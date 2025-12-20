import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { EmployeesSeedersModule } from '../employees/seeders/seeders.module';
import { ShiftsSeedersModule } from '../shifts/seeders/seeders.module';
import { AttendanceSeedersModule } from '../attendance/seeders/seeders.module';
import { EmployeeRequestsSeedersModule } from '../employee-requests/seeders/seeders.module';

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
