import { Injectable } from '@nestjs/common';
import { SuppliersSeeder } from '../suppliers/seeders/suppliers.seeder';
import { ItemsSeeder } from '../items/seeders/items.seeder';
import { MovementsSeeder } from '../movements/seeders/movements.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private suppliersSeeder: SuppliersSeeder,
    private itemsSeeder: ItemsSeeder,
    private movementsSeeder: MovementsSeeder,
  ) {}

  async seed() {
    await this.suppliersSeeder.seed();
    await this.itemsSeeder.seed();
    await this.movementsSeeder.seed();
  }
}
