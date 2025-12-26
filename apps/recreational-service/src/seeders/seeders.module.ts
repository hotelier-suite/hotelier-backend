import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import {
  RecreationalFacilitiesSeeder,
  RecreationalBookingsSeeder,
} from './domains';
import { RecreationalFacility } from '../facilities';
import { RecreationalBooking } from '../bookings';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecreationalFacility, RecreationalBooking]),
  ],
  providers: [
    SeedersService,
    RecreationalFacilitiesSeeder,
    RecreationalBookingsSeeder,
  ],
  exports: [SeedersService],
})
export class SeedersModule {}
