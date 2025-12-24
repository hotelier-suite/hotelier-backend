import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthServiceModule } from './auth-service/auth-service.module';
import { BookingServiceModule } from './booking-service/booking-service.module';
import { DashboardServiceModule } from './dashboard-service/dashboard-service.module';
import { EventsServiceModule } from './events-service/events-service.module';
import { RecreationalServiceModule } from './recreational-service/recreational-service.module';
import { RestaurantServiceModule } from './restaurant-service/restaurant-service.module';
import { InventoryServiceModule } from './inventory-service/inventory-service.module';
import { StaffServiceModule } from './staff-service/staff-service.module';
import { BillingServiceModule } from './billing-service/billing-service.module';
import { OperationsServiceModule } from './operations-service/operations-service.module';
import { ReportsServiceModule } from './reports-service/reports-service.module';
import { NotificationsServiceModule } from './notifications-service/notifications-service.module';
import { AuditServiceModule } from './audit-service/audit-service.module';
import { AuditLogInterceptor } from './audit-service/audit/interceptors/audit-log.interceptor';
import { RpcToHttpExceptionInterceptor } from './common/interceptors/rpc-to-http-exception.interceptor';
import { ConfigServiceModule } from './config-service/config-service.module';
import { ParkingServiceModule } from './parking-service/parking-service.module';
import { GuestRequestsServiceModule } from './guest-requests-service/guest-requests-service.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthServiceModule,
    BookingServiceModule,
    DashboardServiceModule,
    EventsServiceModule,
    RecreationalServiceModule,
    RestaurantServiceModule,
    InventoryServiceModule,
    StaffServiceModule,
    BillingServiceModule,
    OperationsServiceModule,
    ReportsServiceModule,
    NotificationsServiceModule,
    AuditServiceModule,
    ConfigServiceModule,
    ParkingServiceModule,
    GuestRequestsServiceModule,
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
