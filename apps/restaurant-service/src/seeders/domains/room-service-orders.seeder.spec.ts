import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomServiceOrdersSeeder } from './room-service-orders.seeder';
import { RoomServiceOrder } from '../../room-service-orders';

describe('RoomServiceOrdersSeeder', () => {
  let seeder: RoomServiceOrdersSeeder;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = { findOne: jest.fn(), save: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomServiceOrdersSeeder,
        { provide: getRepositoryToken(RoomServiceOrder), useValue: repo },
      ],
    }).compile();
    seeder = module.get(RoomServiceOrdersSeeder);
  });

  it('should seed orders when none exist', async () => {
    repo.findOne.mockResolvedValue(null);
    repo.save.mockImplementation((d) => Promise.resolve(d));
    await seeder.seed();
    expect(repo.save).toHaveBeenCalledTimes(3);
  });

  it('should skip existing orders', async () => {
    repo.findOne.mockResolvedValue({ id: 1 });
    await seeder.seed();
    expect(repo.save).not.toHaveBeenCalled();
  });
});
