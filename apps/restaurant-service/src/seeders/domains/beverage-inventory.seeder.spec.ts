import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BeverageInventorySeeder } from './beverage-inventory.seeder';
import { BeverageInventory } from '../../beverage-inventory';

describe('BeverageInventorySeeder', () => {
  let seeder: BeverageInventorySeeder;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = { findOne: jest.fn(), save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BeverageInventorySeeder,
        { provide: getRepositoryToken(BeverageInventory), useValue: repo },
      ],
    }).compile();
    seeder = module.get(BeverageInventorySeeder);
  });

  it('should seed beverages when none exist', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.save.mockImplementation((d) => Promise.resolve(d));
    await seeder.seed();
    expect(repo.save).toHaveBeenCalledTimes(8);
  });

  it('should skip existing beverages', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    await seeder.seed();
    expect(repo.save).not.toHaveBeenCalled();
  });
});
