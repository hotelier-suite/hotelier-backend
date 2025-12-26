import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { GuestsSeedersModule } from '../guests';
import { ReservationsSeedersModule } from '../reservations';
import { RoomsSeedersModule } from '../rooms';

@Module({
  imports: [RoomsSeedersModule, GuestsSeedersModule, ReservationsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
