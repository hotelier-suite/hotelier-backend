import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { EventBooking } from './entities';
import { Venue } from '../venues';

@Module({
  imports: [TypeOrmModule.forFeature([EventBooking, Venue])],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService],
})
export class BookingsModule {}
