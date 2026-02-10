import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import {
  MenuItemsSeeder,
  RoomServiceOrdersSeeder,
  BeverageInventorySeeder,
} from './domains';
import { MenuItem } from '../menu-items';
import { RoomServiceOrder } from '../room-service-orders';
import { BeverageInventory } from '../beverage-inventory';

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
