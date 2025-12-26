import { Injectable } from '@nestjs/common';
import {
  MenuItemsSeeder,
  RoomServiceOrdersSeeder,
  BeverageInventorySeeder,
} from './domains';

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
