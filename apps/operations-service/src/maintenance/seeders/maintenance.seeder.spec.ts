import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MaintenanceSeeder } from './';
import { GeneralMaintenanceRequest } from '../entities';

describe('MaintenanceSeeder', () => {
  let seeder: MaintenanceSeeder;
  const mockRepository: Record<string, jest.Mock> = {
    count: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MaintenanceSeeder,
        {
          provide: getRepositoryToken(GeneralMaintenanceRequest),
          useValue: mockRepository,
        },
      ],
    }).compile();

    seeder = module.get<MaintenanceSeeder>(MaintenanceSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should skip seeding when data already exists', async () => {
    mockRepository.count.mockResolvedValueOnce(3);
    await seeder.seed();
    expect(mockRepository.count).toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should seed data when table is empty', async () => {
    mockRepository.count.mockResolvedValueOnce(0);
    mockRepository.save.mockResolvedValue({});
    await seeder.seed();
    expect(mockRepository.count).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledTimes(5);
  });
});
