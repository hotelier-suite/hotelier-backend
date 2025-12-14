import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { RoomServiceOrdersSeeder } from './domains/room-service-orders.seeder';
import { MenuItemsSeeder } from './domains/menu-items.seeder';
import { BeverageInventorySeeder } from './domains/beverage-inventory.seeder';
import { RoomServiceOrder } from '../entities/room-service-order.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { BeverageInventory } from '../entities/beverage-inventory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoomServiceOrder, MenuItem, BeverageInventory]),
  ],
  providers: [
    SeedersService,
    RoomServiceOrdersSeeder,
    MenuItemsSeeder,
    BeverageInventorySeeder,
  ],
  exports: [SeedersService],
})
export class SeedersModule {}
