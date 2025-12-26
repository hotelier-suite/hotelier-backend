import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import {
  RecreationalFacilitiesSeeder,
  RecreationalBookingsSeeder,
} from './domains';
import { RecreationalFacility, RecreationalBooking } from '../recreational';

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
