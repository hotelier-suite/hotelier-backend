import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Guest } from './entities/guest.entity';
import { Reservation } from './entities/reservation.entity';

import { Room } from '../rooms/entities/room.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { InvoiceItem } from '../billing/entities/invoice-item.entity';
import { RoomServiceOrder } from '../restaurant/entities/room-service-order.entity';
import { SeedersModule } from './seeders/seeders.module';
import { AuthModule } from '../auth-service/auth/auth.module';
import { HousekeepingModule } from '../housekeeping/housekeeping.module';
import { NotificationsModule } from '../notifications-service/notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Guest,
      Reservation,
      Room,
      Invoice,
      InvoiceItem,
      RoomServiceOrder,
    ]),
    SeedersModule,
    AuthModule,
    HousekeepingModule,
    NotificationsModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService, SeedersModule],
})
export class ReservationsModule {}
