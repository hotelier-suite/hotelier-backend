import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { AttendanceModule } from './attendance';
import { EmployeeRequestsModule } from './employee-requests';
import { EmployeesModule } from './employees';
import { NotificationsServiceModule } from './notifications-service';
import { SeedersModule } from './seeders';
import { ShiftsModule } from './shifts';

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
