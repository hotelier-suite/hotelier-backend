import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsSeeder } from './bookings.seeder';
import { EventBooking } from '../entities';
import { Venue } from '../../venues';

@Module({
  imports: [TypeOrmModule.forFeature([EventBooking, Venue])],
  providers: [BookingsSeeder],
  exports: [BookingsSeeder],
})
export class BookingsSeedersModule {}
