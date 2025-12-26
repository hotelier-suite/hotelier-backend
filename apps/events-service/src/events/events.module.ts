import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event, EventBooking } from './entities';
import { Venue } from '../venues';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventBooking, Venue])],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
