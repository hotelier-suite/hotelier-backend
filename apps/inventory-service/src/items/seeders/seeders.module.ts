import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsSeeder } from './items.seeder';
import { InventoryItem } from '../entities';
import { Supplier } from '../../suppliers';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryItem, Supplier])],
  providers: [ItemsSeeder],
  exports: [ItemsSeeder],
})
export class ItemsSeedersModule {}
