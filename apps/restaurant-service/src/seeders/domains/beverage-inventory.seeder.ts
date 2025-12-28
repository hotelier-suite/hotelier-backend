import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BeverageInventory } from '../../beverage-inventory';
import { BeverageStatus } from '@app/contracts/restaurant-service';

@Injectable()
export class BeverageInventorySeeder {
  constructor(
    @InjectRepository(BeverageInventory)
    private beverageRepository: Repository<BeverageInventory>,
  ) {}

  async seed() {
    const beverages = [
      {
        itemCode: 'ALC001',
        name: 'Premium Red Wine',
        category: 'Wine',
        stock: 24,
        minimumStock: 6,
        unit: 'bottles',
        unitCost: 25.0,
        supplier: 'Wine Distributors Ltd',
        lastPurchase: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        itemCode: 'ALC002',
        name: 'Premium White Wine',
        category: 'Wine',
        stock: 18,
        minimumStock: 6,
        unit: 'bottles',
        unitCost: 22.5,
        supplier: 'Wine Distributors Ltd',
        lastPurchase: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        itemCode: 'ALC003',
        name: 'Craft Beer IPA',
        category: 'Beer',
        stock: 48,
        minimumStock: 12,
        unit: 'bottles',
        unitCost: 4.5,
        supplier: 'Local Brewery',
        lastPurchase: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        itemCode: 'ALC004',
        name: 'Premium Whiskey',
        category: 'Spirits',
        stock: 3,
        minimumStock: 2,
        unit: 'bottles',
        unitCost: 85.0,
        supplier: 'Premium Spirits Co',
        lastPurchase: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        status: BeverageStatus.LOW_STOCK,
      },
      {
        itemCode: 'NAL001',
        name: 'Fresh Orange Juice',
        category: 'Juices',
        stock: 15,
        minimumStock: 5,
        unit: 'liters',
        unitCost: 3.5,
        supplier: 'Fresh Fruit Suppliers',
        lastPurchase: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        itemCode: 'NAL002',
        name: 'Premium Coffee Beans',
        category: 'Coffee',
        stock: 8,
        minimumStock: 3,
        unit: 'kg',
        unitCost: 18.0,
        supplier: 'Coffee Roasters Inc',
        lastPurchase: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        itemCode: 'NAL003',
        name: 'Mineral Water',
        category: 'Water',
        stock: 60,
        minimumStock: 20,
        unit: 'bottles',
        unitCost: 1.5,
        supplier: 'Pure Water Co',
        lastPurchase: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        itemCode: 'NAL004',
        name: 'Coca Cola',
        category: 'Soft Drinks',
        stock: 0,
        minimumStock: 24,
        unit: 'cans',
        unitCost: 1.25,
        supplier: 'Beverage Distributors',
        lastPurchase: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        status: BeverageStatus.OUT_OF_STOCK,
      },
    ];

    for (const beverageData of beverages) {
      const existing = await this.beverageRepository.findOne({
        where: { itemCode: beverageData.itemCode },
      });

      if (!existing) {
        await this.beverageRepository.save(beverageData);
      }
    }
  }
}
