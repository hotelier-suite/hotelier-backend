import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsSeeder } from './events.seeder';
import { EventBookingsSeeder } from './event-bookings.seeder';
import { Event } from '../entities/event.entity';
import { EventBooking } from '../entities/event-booking.entity';
import { Venue } from '../../venues/entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventBooking, Venue])],
  providers: [EventsSeeder, EventBookingsSeeder],
  exports: [EventsSeeder, EventBookingsSeeder],
})
export class EventsSeedersModule {}
