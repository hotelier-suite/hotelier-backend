import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './';
import { ReportsSeeder, AnalyticsSeeder } from './domains';

describe('SeedersService', () => {
  let service: SeedersService;
  let reportsSeeder: ReportsSeeder;
  let analyticsSeeder: AnalyticsSeeder;

  const mockReportsSeeder = { seed: jest.fn() };
  const mockAnalyticsSeeder = { seed: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        { provide: ReportsSeeder, useValue: mockReportsSeeder },
        { provide: AnalyticsSeeder, useValue: mockAnalyticsSeeder },
      ],
    }).compile();

    service = module.get<SeedersService>(SeedersService);
    reportsSeeder = module.get<ReportsSeeder>(ReportsSeeder);
    analyticsSeeder = module.get<AnalyticsSeeder>(AnalyticsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(reportsSeeder).toBeDefined();
    expect(analyticsSeeder).toBeDefined();
  });

  it('should call both seeders in order', async () => {
    const reportsSeederSpy = jest
      .spyOn(reportsSeeder, 'seed')
      .mockResolvedValueOnce(undefined);
    const analyticsSeederSpy = jest
      .spyOn(analyticsSeeder, 'seed')
      .mockResolvedValueOnce(undefined);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    await service.seed();

    expect(reportsSeederSpy).toHaveBeenCalledTimes(1);
    expect(analyticsSeederSpy).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });
});
