import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { EventsModule } from './events';
import { BookingsModule } from './bookings';
import { VenuesModule } from './venues';
import { SeedersModule } from './seeders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    EventsModule,
    BookingsModule,
    VenuesModule,
    SeedersModule,
  ],
})
export class EventsServiceModule {}
