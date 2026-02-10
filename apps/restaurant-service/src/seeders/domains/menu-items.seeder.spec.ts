import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItemsSeeder } from './menu-items.seeder';
import { MenuItem } from '../../menu-items';

describe('MenuItemsSeeder', () => {
  let seeder: MenuItemsSeeder;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = { findOne: jest.fn(), save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuItemsSeeder,
        { provide: getRepositoryToken(MenuItem), useValue: repo },
      ],
    }).compile();
    seeder = module.get(MenuItemsSeeder);
  });

  it('should seed items when none exist', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.save.mockImplementation((d) => Promise.resolve(d));
    await seeder.seed();
    expect(repo.save).toHaveBeenCalledTimes(9);
  });

  it('should skip existing items', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    await seeder.seed();
    expect(repo.save).not.toHaveBeenCalled();
  });
});
