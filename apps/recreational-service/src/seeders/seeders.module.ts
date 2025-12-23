import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { RecreationalFacilitiesSeeder } from './domains/recreational-facilities.seeder';
import { RecreationalBookingsSeeder } from './domains/recreational-bookings.seeder';
import { RecreationalFacility } from '../recreational/entities/recreational-facility.entity';
import { RecreationalBooking } from '../recreational/entities/recreational-booking.entity';

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
