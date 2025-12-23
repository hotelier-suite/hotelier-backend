import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { VenuesSeedersModule } from '../venues/seeders/seeders.module';
import { EventsSeedersModule } from '../events/seeders/seeders.module';

@Module({
  imports: [VenuesSeedersModule, EventsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
