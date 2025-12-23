import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { HousekeepingSeedersModule } from '../housekeeping/seeders/seeders.module';
import { MaintenanceSeedersModule } from '../maintenance/seeders/seeders.module';

@Module({
  imports: [HousekeepingSeedersModule, MaintenanceSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
