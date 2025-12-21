import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '../../guests/entities/guest.entity';
import { Room } from '../../rooms/entities/room.entity';
import { Reservation } from '../entities/reservation.entity';
import { ReservationsSeeder } from './reservations.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Room, Guest])],
  providers: [ReservationsSeeder],
  exports: [ReservationsSeeder],
})
export class ReservationsSeedersModule {}
