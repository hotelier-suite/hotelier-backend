import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { EventsSeeder } from './domains/events.seeder';
import { EventBookingsSeeder } from './domains/event-bookings.seeder';
import { Event } from '../entities/event.entity';
import { EventBooking } from '../entities/event-booking.entity';
import { Venue } from '../../venues/entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventBooking, Venue])],
  providers: [SeedersService, EventsSeeder, EventBookingsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
