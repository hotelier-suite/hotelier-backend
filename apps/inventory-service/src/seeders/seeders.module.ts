import { Module } from '@nestjs/common';
import { SeedersService } from './seeders.service';
import { ItemsSeedersModule } from '../items';
import { MovementsSeedersModule } from '../movements';
import { SuppliersSeedersModule } from '../suppliers';

@Module({
  imports: [SuppliersSeedersModule, ItemsSeedersModule, MovementsSeedersModule],
  providers: [SeedersService],
  exports: [SeedersService],
})
export class SeedersModule {}
