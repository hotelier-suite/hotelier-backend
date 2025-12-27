import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { VenuesSeedersModule } from '../venues';
import { EventsSeedersModule } from '../events';
import { BookingsSeedersModule } from '../bookings';

@Module({
  imports: [VenuesSeedersModule, EventsSeedersModule, BookingsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
