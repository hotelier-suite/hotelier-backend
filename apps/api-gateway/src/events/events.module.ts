import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Event } from './entities/event.entity';
import { EventBooking } from './entities/event-booking.entity';
import { Venue } from '../venues/entities/venue.entity';
import { AuthModule } from '../auth-service/auth/auth.module';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, EventBooking, Venue]),
    AuthModule,
    SeedersModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService, SeedersModule],
})
export class EventsModule {}
