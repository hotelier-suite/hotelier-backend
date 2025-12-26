import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import {
  MenuItemsSeeder,
  RoomServiceOrdersSeeder,
  BeverageInventorySeeder,
} from './domains';
import { MenuItem, RoomServiceOrder, BeverageInventory } from '../restaurant';

@Module({
  imports: [
    TypeOrmModule.forFeature([MenuItem, RoomServiceOrder, BeverageInventory]),
  ],
  providers: [
    SeedersService,
    MenuItemsSeeder,
    RoomServiceOrdersSeeder,
    BeverageInventorySeeder,
  ],
  exports: [SeedersService],
})
export class SeedersModule {}
