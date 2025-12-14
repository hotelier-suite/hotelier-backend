import { Injectable } from '@nestjs/common';
import { InventorySeeder } from './domains/inventory.seeder';
import { InventoryMovementsSeeder } from './domains/inventory-movements.seeder';
import { SuppliersSeeder } from './domains/suppliers.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private suppliersSeeder: SuppliersSeeder,
    private inventorySeeder: InventorySeeder,
    private movementsSeeder: InventoryMovementsSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting Inventory module seeding...');

    // Order matters: suppliers first, then inventory items, then movements
    await this.suppliersSeeder.seed();
    console.log('✅ Suppliers seeded');

    await this.inventorySeeder.seed();
    console.log('✅ Inventory items seeded');

    await this.movementsSeeder.seed();
    console.log('✅ Inventory movements seeded');

    console.log('🎉 Inventory module seeding completed!');
  }
}
