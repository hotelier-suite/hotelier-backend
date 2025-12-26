import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthServiceModule } from './auth-service';
import { BookingServiceModule } from './booking-service';
import { DashboardServiceModule } from './dashboard-service';
import { EventsServiceModule } from './events-service';
import { RecreationalServiceModule } from './recreational-service';
import { RestaurantServiceModule } from './restaurant-service';
import { InventoryServiceModule } from './inventory-service';
import { StaffServiceModule } from './staff-service';
import { BillingServiceModule } from './billing-service';
import { OperationsServiceModule } from './operations-service';
import { ReportsServiceModule } from './reports-service';
import { NotificationsServiceModule } from './notifications-service';
import { AuditServiceModule, AuditLogInterceptor } from './audit-service';
import { RpcToHttpExceptionInterceptor } from './common';
import { ConfigServiceModule } from './config-service';
import { ParkingServiceModule } from './parking-service';
import { GuestRequestsServiceModule } from './guest-requests-service';

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
