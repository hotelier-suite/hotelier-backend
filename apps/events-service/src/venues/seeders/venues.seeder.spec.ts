// Break circular dependency: venue.entity -> ../../bookings barrel
jest.mock('../../bookings', () => ({
  EventBooking: class EventBooking {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { VenuesSeeder } from './venues.seeder';
import { Venue } from '../entities';

describe('VenuesSeeder', () => {
  let seeder: VenuesSeeder;
  let repository: Record<string, jest.Mock>;

  beforeEach(async () => {
    repository = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VenuesSeeder,
        { provide: getRepositoryToken(Venue), useValue: repository },
      ],
    }).compile();

    seeder = module.get(VenuesSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed venues when none exist', async () => {
    repository.findOne.mockResolvedValue(null);
    repository.save.mockResolvedValue({});

    await seeder.seed();

    expect(repository.findOne).toHaveBeenCalledTimes(5);
    expect(repository.save).toHaveBeenCalledTimes(5);
  });

  it('should skip existing venues', async () => {
    repository.findOne.mockResolvedValue({ id: 1, name: 'Existing' });
    repository.save.mockResolvedValue({});

    await seeder.seed();

    expect(repository.findOne).toHaveBeenCalledTimes(5);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('should seed only missing venues', async () => {
    repository.findOne
      .mockResolvedValueOnce({ id: 1, name: 'Existing' })
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: 4, name: 'Existing' })
      .mockResolvedValueOnce(null);
    repository.save.mockResolvedValue({});

    await seeder.seed();

    expect(repository.save).toHaveBeenCalledTimes(3);
  });
});
