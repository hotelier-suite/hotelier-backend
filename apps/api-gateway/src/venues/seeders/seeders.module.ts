import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { VenuesSeeder } from './domains/venues.seeder';
import { Venue } from '../entities/venue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Venue])],
  providers: [SeedersService, VenuesSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
