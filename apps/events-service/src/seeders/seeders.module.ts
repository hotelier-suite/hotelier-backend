import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { VenuesSeedersModule } from '../venues';
import { EventsSeedersModule } from '../events';

@Module({
  imports: [VenuesSeedersModule, EventsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
