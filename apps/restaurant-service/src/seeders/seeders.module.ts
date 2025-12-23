import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { MenuItemsSeeder } from './domains/menu-items.seeder';
import { RoomServiceOrdersSeeder } from './domains/room-service-orders.seeder';
import { BeverageInventorySeeder } from './domains/beverage-inventory.seeder';
import { MenuItem } from '../restaurant/entities/menu-item.entity';
import { RoomServiceOrder } from '../restaurant/entities/room-service-order.entity';
import { BeverageInventory } from '../restaurant/entities/beverage-inventory.entity';

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
