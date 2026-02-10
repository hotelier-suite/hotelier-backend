import { Injectable } from '@nestjs/common';
import { SuppliersSeeder } from '../suppliers';
import { ItemsSeeder } from '../items';
import { MovementsSeeder } from '../movements';

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
