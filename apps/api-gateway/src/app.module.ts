import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthServiceModule } from './auth-service/auth-service.module';
import { DatabaseModule } from './database/database.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RoomsModule } from './rooms/rooms.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { EmployeesModule } from './employees/employees.module';
import { VenuesModule } from './venues/venues.module';
import { GuestRequestsModule } from './guest-requests/guest-requests.module';
import { EventsModule } from './events/events.module';
import { RecreationalModule } from './recreational/recreational.module';
import { RestaurantModule } from './restaurant/restaurant.module';
import { InventoryModule } from './inventory/inventory.module';
import { BillingModule } from './billing/billing.module';
import { ParkingModule } from './parking/parking.module';
import { HousekeepingModule } from './housekeeping/housekeeping.module';
import { ReportsModule } from './reports/reports.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ShiftsModule } from './shifts/shifts.module';
import { AttendanceModule } from './attendance/attendance.module';
import { EmployeeRequestsModule } from './employee-requests/employee-requests.module';
import { ReportsAnalyticsModule } from './reports-analytics/reports-analytics.module';
import { MaintenanceModule } from './maintenance/maintenance.module';
import { NotificationsModule } from './notifications/notifications.module';
import { GuestsModule } from './guests/guests.module';
import { AuditModule } from './audit/audit.module';
import { AuditLogInterceptor } from './audit/interceptors/audit-log.interceptor';
import { RpcToHttpExceptionInterceptor } from './common/interceptors/rpc-to-http-exception.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthServiceModule,
    DatabaseModule,
    ReservationsModule,
    RoomsModule,
    DashboardModule,
    EmployeesModule,
    VenuesModule,
    GuestRequestsModule,
    EventsModule,
    RecreationalModule,
    RestaurantModule,
    InventoryModule,
    BillingModule,
    ParkingModule,
    HousekeepingModule,
    ReportsModule,
    ConfigurationModule,
    ShiftsModule,
    AttendanceModule,
    EmployeeRequestsModule,
    ReportsAnalyticsModule,
    MaintenanceModule,
    NotificationsModule,
    GuestsModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: RpcToHttpExceptionInterceptor,
    },
  ],
})
export class AppModule {}
