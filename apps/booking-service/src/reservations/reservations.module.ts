import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '../guests/entities/guest.entity';
import { Room } from '../rooms/entities/room.entity';
import { ReservationsController } from './reservations.controller';
import { Reservation } from './entities/reservation.entity';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Room, Guest])],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
