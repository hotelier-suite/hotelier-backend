jest.mock('../../suppliers', () => ({
  Supplier: class Supplier {},
}));
jest.mock('../../movements', () => ({
  InventoryMovement: class InventoryMovement {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemsSeeder, InventoryItem } from '../';

describe('ItemsSeeder', () => {
  let seeder: ItemsSeeder;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsSeeder,
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: repo,
        },
      ],
    }).compile();

    seeder = module.get(ItemsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should create items that do not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.save.mockResolvedValue({});

      await seeder.seed();

      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });

    it('should skip items that already exist', async () => {
      repo.findOne.mockResolvedValue({ id: 1, name: 'Existing' });

      await seeder.seed();

      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });
  });
});
