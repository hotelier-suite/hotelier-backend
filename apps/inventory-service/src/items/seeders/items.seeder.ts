import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryItem } from '../entities';
import {
  InventoryCategory,
  CreateInventoryItemDto,
} from '@app/contracts/inventory-service';

@Injectable()
export class ItemsSeeder {
  constructor(
    @InjectRepository(InventoryItem)
    private readonly inventoryRepository: Repository<InventoryItem>,
  ) {}

  async seed(): Promise<void> {
    const items: CreateInventoryItemDto[] = [
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
      },
    ];

    for (const itemData of items) {
      const existing = await this.inventoryRepository.findOne({
        where: { name: itemData.name },
      });

      if (!existing) {
        await this.inventoryRepository.save(itemData);
      }
    }
  }
}
