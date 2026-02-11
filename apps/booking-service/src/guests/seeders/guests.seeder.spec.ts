jest.mock('../../reservations', () => ({
  Reservation: class Reservation {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuestsSeeder, Guest } from '../';

describe('GuestsSeeder', () => {
  let seeder: GuestsSeeder;
  const mockRepository: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GuestsSeeder,
        { provide: getRepositoryToken(Guest), useValue: mockRepository },
      ],
    }).compile();

    seeder = module.get<GuestsSeeder>(GuestsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed guests when they do not exist', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockRepository.findOne).toHaveBeenCalledTimes(3);
    expect(mockRepository.save).toHaveBeenCalledTimes(3);
  });

  it('should skip seeding when guests already exist', async () => {
    mockRepository.findOne.mockResolvedValue({ id: 1 });

    await seeder.seed();

    expect(mockRepository.findOne).toHaveBeenCalledTimes(3);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should seed only missing guests', async () => {
    mockRepository.findOne
      .mockResolvedValueOnce({ id: 1 }) // first exists
      .mockResolvedValueOnce(null) // second missing
      .mockResolvedValueOnce(null); // third missing
    mockRepository.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockRepository.save).toHaveBeenCalledTimes(2);
  });
});
