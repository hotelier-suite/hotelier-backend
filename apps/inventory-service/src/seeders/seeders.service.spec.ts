jest.mock('../suppliers', () => ({
  SuppliersSeeder: jest.fn().mockImplementation(() => ({
    seed: jest.fn().mockResolvedValue(undefined),
  })),
  Supplier: class Supplier {},
}));
jest.mock('../items', () => ({
  ItemsSeeder: jest.fn().mockImplementation(() => ({
    seed: jest.fn().mockResolvedValue(undefined),
  })),
  InventoryItem: class InventoryItem {},
}));
jest.mock('../movements', () => ({
  MovementsSeeder: jest.fn().mockImplementation(() => ({
    seed: jest.fn().mockResolvedValue(undefined),
  })),
  InventoryMovement: class InventoryMovement {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './';
import { SuppliersSeeder } from '../suppliers';
import { ItemsSeeder } from '../items';
import { MovementsSeeder } from '../movements';

describe('SeedersService', () => {
  let service: SeedersService;
  let suppliersSeeder: SuppliersSeeder;
  let itemsSeeder: ItemsSeeder;
  let movementsSeeder: MovementsSeeder;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        {
          provide: SuppliersSeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: ItemsSeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
        {
          provide: MovementsSeeder,
          useValue: { seed: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get(SeedersService);
    suppliersSeeder = module.get(SuppliersSeeder);
    itemsSeeder = module.get(ItemsSeeder);
    movementsSeeder = module.get(MovementsSeeder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should call all seeders in order', async () => {
      const callOrder: string[] = [];
      jest.spyOn(suppliersSeeder, 'seed').mockImplementation(() => {
        callOrder.push('suppliers');
        return Promise.resolve();
      });
      jest.spyOn(itemsSeeder, 'seed').mockImplementation(() => {
        callOrder.push('items');
        return Promise.resolve();
      });
      jest.spyOn(movementsSeeder, 'seed').mockImplementation(() => {
        callOrder.push('movements');
        return Promise.resolve();
      });

      await service.seed();

      expect(callOrder).toEqual(['suppliers', 'items', 'movements']);
    });

    it('should call each seeder once', async () => {
      const suppliersSpy = jest.spyOn(suppliersSeeder, 'seed');
      const itemsSpy = jest.spyOn(itemsSeeder, 'seed');
      const movementsSpy = jest.spyOn(movementsSeeder, 'seed');

      await service.seed();

      expect(suppliersSpy).toHaveBeenCalledTimes(1);
      expect(itemsSpy).toHaveBeenCalledTimes(1);
      expect(movementsSpy).toHaveBeenCalledTimes(1);
    });
  });
});
