import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { RecreationalBooking } from './entities';
import { RecreationalFacility } from '../facilities/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecreationalBooking, RecreationalFacility]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService, TypeOrmModule],
})
export class BookingsModule {}
