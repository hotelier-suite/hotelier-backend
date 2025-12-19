import { Injectable } from '@nestjs/common';
import { RoomServiceOrdersSeeder } from './domains/room-service-orders.seeder';
import { MenuItemsSeeder } from './domains/menu-items.seeder';
import { BeverageInventorySeeder } from './domains/beverage-inventory.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private roomServiceOrdersSeeder: RoomServiceOrdersSeeder,
    private menuItemsSeeder: MenuItemsSeeder,
    private beverageInventorySeeder: BeverageInventorySeeder,
  ) {}

  async seed() {
    // Order matters: menu items and beverages first, then orders
    await this.menuItemsSeeder.seed();
    await this.beverageInventorySeeder.seed();
    await this.roomServiceOrdersSeeder.seed();
  }
}
