import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsSeeder } from './events.seeder';
import { Event } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([Event])],
  providers: [EventsSeeder],
  exports: [EventsSeeder],
})
export class EventsSeedersModule {}
