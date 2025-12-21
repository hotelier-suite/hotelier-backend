import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { GuestsSeedersModule } from '../guests/seeders/seeders.module';
import { ReservationsSeedersModule } from '../reservations/seeders/seeders.module';
import { RoomsSeedersModule } from '../rooms/seeders/seeders.module';

@Module({
  imports: [RoomsSeedersModule, GuestsSeedersModule, ReservationsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
