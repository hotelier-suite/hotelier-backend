import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { VehiclesSeedersModule } from '../vehicles';
import { SpacesSeedersModule } from '../spaces';
import { IncidentsSeedersModule } from '../incidents';

@Module({
  imports: [VehiclesSeedersModule, SpacesSeedersModule, IncidentsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
