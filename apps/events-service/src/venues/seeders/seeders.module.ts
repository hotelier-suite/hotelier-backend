import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VenuesSeeder } from './venues.seeder';
import { Venue } from '../entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue])],
  providers: [VenuesSeeder],
  exports: [VenuesSeeder],
})
export class VenuesSeedersModule {}
