import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../entities/inventory-item.entity';
import { Supplier } from '../../suppliers/entities/supplier.entity';
import { InventoryCategory } from '@app/contracts/inventory-service/items/enums/inventory-category.enum';
import { InventoryStatus } from '@app/contracts/inventory-service/items/enums/inventory-status.enum';

@Injectable()
export class ItemsSeeder {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
    @InjectRepository(Supplier)
    private readonly supplierRepository: Repository<Supplier>,
  ) {}

  async seed(): Promise<void> {
    const items: Array<
      Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt' | 'movements'>
    > = [
      {
        name: 'Sheets - White Cotton King',
        category: InventoryCategory.LINENS,
        currentStock: 150,
        minimumStock: 30,
        maximumStock: 200,
        unit: 'pieces',
        unitCost: 35.0,
        supplier: 'Premium Linen Suppliers',
        location: 'Warehouse A - Section 1',
        status: InventoryStatus.AVAILABLE,
      },
      {
        name: 'Comforters - Premium Down',
        category: InventoryCategory.LINENS,
        currentStock: 18,
        minimumStock: 15,
        maximumStock: 50,
        unit: 'pieces',
        unitCost: 85.0,
        supplier: 'Premium Linen Suppliers',
        location: 'Warehouse A - Section 3',
        status: InventoryStatus.LOW_STOCK,
      },
      {
        name: 'Premium Shampoo 50ml',
        category: InventoryCategory.AMENITIES,
        currentStock: 800,
        minimumStock: 150,
        maximumStock: 1200,
        unit: 'bottles',
        unitCost: 2.75,
        supplier: 'Hotel Amenities Inc.',
        location: 'Warehouse B - Shelf 1',
        status: InventoryStatus.AVAILABLE,
      },
      {
        name: 'Body Lotion 30ml',
        category: InventoryCategory.AMENITIES,
        currentStock: 85,
        minimumStock: 80,
        maximumStock: 400,
        unit: 'bottles',
        unitCost: 3.25,
        supplier: 'Hotel Amenities Inc.',
        location: 'Warehouse B - Shelf 2',
        status: InventoryStatus.LOW_STOCK,
      },
      {
        name: 'Industrial Multi-Purpose Cleaner',
        category: InventoryCategory.CLEANING_SUPPLIES,
        currentStock: 45,
        minimumStock: 20,
        maximumStock: 80,
        unit: 'bottles',
        unitCost: 12.5,
        supplier: 'CleanPro Supplies',
        location: 'Warehouse C - Zone 1',
        status: InventoryStatus.AVAILABLE,
      },
      {
        name: 'Universal TV Remote Control',
        category: InventoryCategory.ELECTRONICS,
        currentStock: 25,
        minimumStock: 8,
        maximumStock: 40,
        unit: 'pieces',
        unitCost: 18.5,
        supplier: 'Direct Electronics',
        location: 'Warehouse D - Rack 1',
        status: InventoryStatus.AVAILABLE,
      },
    ];

    for (const itemData of items) {
      const existing = await this.inventoryRepository.findOne({
        where: { name: itemData.name },
      });

      if (!existing) {
        const supplier = await this.supplierRepository.findOne({
          where: { name: itemData.supplier },
        });

        await this.inventoryRepository.save({
          ...itemData,
          supplierId: supplier?.id,
        });
      }
    }
  }
}
