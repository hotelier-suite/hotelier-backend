import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AnalyticsSeeder } from './';
import { AnalyticsData } from '../../analytics';
import { AnalyticsMetric } from '@app/contracts/reports-service';

describe('AnalyticsSeeder', () => {
  let seeder: AnalyticsSeeder;

  const mockRepository: Record<string, jest.Mock> = {
    count: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsSeeder,
        {
          provide: getRepositoryToken(AnalyticsData),
          useValue: mockRepository,
        },
      ],
    }).compile();

    seeder = module.get<AnalyticsSeeder>(AnalyticsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should skip seeding when data already exists', async () => {
    mockRepository.count.mockResolvedValueOnce(10);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await seeder.seed();
    expect(mockRepository.count).toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should seed analytics data when empty', async () => {
    mockRepository.count.mockResolvedValueOnce(0);
    mockRepository.save.mockResolvedValueOnce([]);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await seeder.seed();
    expect(mockRepository.count).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ metric: AnalyticsMetric.OCCUPANCY_RATE }),
        expect.objectContaining({ metric: AnalyticsMetric.REVENUE_PER_ROOM }),
      ]),
    );
    consoleSpy.mockRestore();
  });
});
