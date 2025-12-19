import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { GuestsSeeder } from './domains/guests.seeder';
import { ReservationsSeeder } from './domains/reservations.seeder';
import { Guest } from '../entities/guest.entity';
import { Reservation } from '../entities/reservation.entity';
import { Room } from '../../rooms/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Guest, Reservation, Room])],
  providers: [SeedersService, GuestsSeeder, ReservationsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
