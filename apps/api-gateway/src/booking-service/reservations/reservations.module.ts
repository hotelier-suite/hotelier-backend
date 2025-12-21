import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { Invoice } from '../../billing/entities/invoice.entity';
import { RoomServiceOrder } from '../../restaurant/entities/room-service-order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, RoomServiceOrder])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
