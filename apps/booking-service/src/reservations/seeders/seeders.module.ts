import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guest } from '../../guests';
import { Room } from '../../rooms';
import { Reservation } from '../entities';
import { ReservationsSeeder } from './reservations.seeder';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Room, Guest])],
  providers: [ReservationsSeeder],
  exports: [ReservationsSeeder],
})
export class ReservationsSeedersModule {}
