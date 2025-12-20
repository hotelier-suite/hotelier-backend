import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsSeeder } from './items.seeder';
import { InventoryItem } from '../entities/inventory-item.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, Supplier])],
  providers: [ItemsSeeder],
  exports: [ItemsSeeder],
})
export class ItemsSeedersModule {}
