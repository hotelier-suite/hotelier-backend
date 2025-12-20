import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { ItemsSeedersModule } from '../items/seeders/seeders.module';
import { MovementsSeedersModule } from '../movements/seeders/seeders.module';
import { SuppliersSeedersModule } from '../suppliers/seeders/seeders.module';

@Module({
  imports: [SuppliersSeedersModule, ItemsSeedersModule, MovementsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
