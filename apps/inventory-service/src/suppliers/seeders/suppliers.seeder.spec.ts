jest.mock('../../items', () => ({
  InventoryItem: class InventoryItem {},
}));
jest.mock('../../movements', () => ({
  InventoryMovement: class InventoryMovement {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SuppliersSeeder, Supplier } from '../';

describe('SuppliersSeeder', () => {
  let seeder: SuppliersSeeder;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SuppliersSeeder,
        {
          provide: getRepositoryToken(Supplier),
          useValue: repo,
        },
      ],
    }).compile();

    seeder = module.get(SuppliersSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should create suppliers that do not exist', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.save.mockResolvedValue({});

      await seeder.seed();

      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });

    it('should skip suppliers that already exist', async () => {
      repo.findOne.mockResolvedValue({ id: 1, name: 'Existing' });

      await seeder.seed();

      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.save).not.toHaveBeenCalled();
    });
  });
});
