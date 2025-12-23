import { Injectable } from '@nestjs/common';
import { MenuItemsSeeder } from './domains/menu-items.seeder';
import { RoomServiceOrdersSeeder } from './domains/room-service-orders.seeder';
import { BeverageInventorySeeder } from './domains/beverage-inventory.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private menuItemsSeeder: MenuItemsSeeder,
    private roomServiceOrdersSeeder: RoomServiceOrdersSeeder,
    private beverageInventorySeeder: BeverageInventorySeeder,
  ) {}

  async seed() {
    // Order matters: menu items and beverages first, then orders
    await this.menuItemsSeeder.seed();
    await this.beverageInventorySeeder.seed();
    await this.roomServiceOrdersSeeder.seed();
  }
}
