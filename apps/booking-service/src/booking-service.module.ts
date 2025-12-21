import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { GuestsModule } from './guests/guests.module';
import { SeedersModule } from './seeders/seeders.module';
import { NotificationsServiceModule } from './notifications-service/notifications-service.module';
import { ReservationsModule } from './reservations/reservations.module';
import { RoomsModule } from './rooms/rooms.module';

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
