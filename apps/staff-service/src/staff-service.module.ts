import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AttendanceModule } from './attendance/attendance.module';
import { EmployeeRequestsModule } from './employee-requests/employee-requests.module';
import { EmployeesModule } from './employees/employees.module';
import { NotificationsServiceModule } from './notifications-service/notifications-service.module';
import { SeedersModule } from './seeders/seeders.module';
import { ShiftsModule } from './shifts/shifts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AttendanceModule,
    EmployeeRequestsModule,
    EmployeesModule,
    NotificationsServiceModule,
    SeedersModule,
    ShiftsModule,
  ],
})
export class StaffServiceModule {}
