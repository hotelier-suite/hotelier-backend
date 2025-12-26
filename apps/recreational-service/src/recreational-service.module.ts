import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { FacilitiesModule } from './facilities';
import { BookingsModule } from './bookings';
import { SeedersModule } from './seeders';
import { NotificationsServiceModule } from './notifications-service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    NotificationsServiceModule,
    FacilitiesModule,
    BookingsModule,
    SeedersModule,
  ],
})
export class RecreationalServiceModule {}
