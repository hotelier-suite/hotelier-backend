import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { HousekeepingSeedersModule } from '../housekeeping';
import { MaintenanceSeedersModule } from '../maintenance';

@Module({
  imports: [HousekeepingSeedersModule, MaintenanceSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
