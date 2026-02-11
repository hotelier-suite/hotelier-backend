jest.mock('../../items', () => ({
  InventoryItem: class InventoryItem {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MovementsSeeder, InventoryMovement } from '../';
import { InventoryItem } from '../../items';
import { InventoryStatus } from '@app/contracts/inventory-service';

describe('MovementsSeeder', () => {
  let seeder: MovementsSeeder;
  let movementRepo: Record<string, jest.Mock>;
  let inventoryRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    movementRepo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };
    inventoryRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovementsSeeder,
        {
          provide: getRepositoryToken(InventoryMovement),
          useValue: movementRepo,
        },
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: inventoryRepo,
        },
      ],
    }).compile();

    seeder = module.get(MovementsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should create movements for existing inventory items', async () => {
      const items = [
        {
          id: 1,
          name: 'Item 1',
          currentStock: 50,
          minimumStock: 20,
          status: InventoryStatus.AVAILABLE,
        },
        {
          id: 2,
          name: 'Item 2',
          currentStock: 30,
          minimumStock: 10,
          status: InventoryStatus.AVAILABLE,
        },
      ];
      inventoryRepo.find.mockResolvedValueOnce(items);
      movementRepo.findOne.mockResolvedValue(null);
      inventoryRepo.findOne
        .mockResolvedValueOnce({ ...items[0] })
        .mockResolvedValueOnce({ ...items[0] })
        .mockResolvedValueOnce({ ...items[1] });
      movementRepo.save.mockResolvedValue({});
      inventoryRepo.save.mockResolvedValue({});

      await seeder.seed();

      expect(movementRepo.save).toHaveBeenCalled();
      expect(inventoryRepo.save).toHaveBeenCalled();
    });

    it('should skip movements that already exist', async () => {
      const items = [
        {
          id: 1,
          name: 'Item 1',
          currentStock: 50,
          minimumStock: 20,
          status: InventoryStatus.AVAILABLE,
        },
        {
          id: 2,
          name: 'Item 2',
          currentStock: 30,
          minimumStock: 10,
          status: InventoryStatus.AVAILABLE,
        },
      ];
      inventoryRepo.find.mockResolvedValueOnce(items);
      movementRepo.findOne.mockResolvedValue({ id: 1 });

      await seeder.seed();

      expect(movementRepo.save).not.toHaveBeenCalled();
    });

    it('should skip when inventory item is not found for movement', async () => {
      const items = [
        {
          id: 1,
          name: 'Item 1',
          currentStock: 50,
          minimumStock: 20,
          status: InventoryStatus.AVAILABLE,
        },
      ];
      inventoryRepo.find.mockResolvedValueOnce(items);
      movementRepo.findOne.mockResolvedValue(null);
      inventoryRepo.findOne.mockResolvedValue(null);

      await seeder.seed();

      expect(movementRepo.save).not.toHaveBeenCalled();
    });

    it('should handle empty inventory items', async () => {
      inventoryRepo.find.mockResolvedValueOnce([]);

      await seeder.seed();

      expect(movementRepo.findOne).not.toHaveBeenCalled();
    });

    it('should skip movement when resulting stock would be negative', async () => {
      const items = [
        {
          id: 1,
          name: 'Item 1',
          currentStock: 0,
          minimumStock: 20,
          status: InventoryStatus.OUT_OF_STOCK,
        },
        {
          id: 2,
          name: 'Item 2',
          currentStock: 30,
          minimumStock: 10,
          status: InventoryStatus.AVAILABLE,
        },
      ];
      inventoryRepo.find.mockResolvedValueOnce(items);
      movementRepo.findOne.mockResolvedValue(null);
      // First movement for item0 is IN (quantity 10) - OK
      inventoryRepo.findOne
        .mockResolvedValueOnce({ ...items[0] }) // IN movement for item0
        .mockResolvedValueOnce({ ...items[0], currentStock: 10 }) // OUT movement for item0 (qty 2)
        .mockResolvedValueOnce({ ...items[1] }); // IN movement for item1
      movementRepo.save.mockResolvedValue({});
      inventoryRepo.save.mockResolvedValue({});

      await seeder.seed();

      expect(movementRepo.save).toHaveBeenCalled();
    });
  });
});
