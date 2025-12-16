import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { VehiclesSeedersModule } from '../vehicles/seeders/seeders.module';
import { SpacesSeedersModule } from '../spaces/seeders/seeders.module';
import { IncidentsSeedersModule } from '../incidents/seeders/seeders.module';

@Module({
  imports: [VehiclesSeedersModule, SpacesSeedersModule, IncidentsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
