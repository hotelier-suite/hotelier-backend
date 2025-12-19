import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { InventorySeeder } from './domains/inventory.seeder';
import { InventoryMovementsSeeder } from './domains/inventory-movements.seeder';
import { SuppliersSeeder } from './domains/suppliers.seeder';
import { Inventory } from '../entities/inventory.entity';
import { InventoryMovement } from '../entities/inventory-movement.entity';
import { Supplier } from '../entities/supplier.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Inventory, InventoryMovement, Supplier])],
  providers: [
    SeedersService,
    SuppliersSeeder,
    InventorySeeder,
    InventoryMovementsSeeder,
  ],
  exports: [SeedersService],
})
export class SeedersModule {}
