import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { GuestsModule } from './guests';
import { SeedersModule } from './seeders';
import { NotificationsServiceModule } from './notifications-service';
import { ReservationsModule } from './reservations';
import { RoomsModule } from './rooms';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    RoomsModule,
    GuestsModule,
    ReservationsModule,
    NotificationsServiceModule,
    SeedersModule,
  ],
})
export class BookingServiceModule {}
