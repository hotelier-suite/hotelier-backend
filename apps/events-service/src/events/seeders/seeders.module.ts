import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsSeeder } from './events.seeder';
import { EventBookingsSeeder } from './event-bookings.seeder';
import { Event, EventBooking } from '../entities';
import { Venue } from '../../venues';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventBooking, Venue])],
  providers: [EventsSeeder, EventBookingsSeeder],
  exports: [EventsSeeder, EventBookingsSeeder],
})
export class EventsSeedersModule {}
