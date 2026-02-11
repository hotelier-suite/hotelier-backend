import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './';
import { WidgetsSeeder } from './domains';

describe('SeedersService', () => {
  let service: SeedersService;

  const mockWidgetsSeeder = { seed: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        { provide: WidgetsSeeder, useValue: mockWidgetsSeeder },
      ],
    }).compile();

    service = module.get<SeedersService>(SeedersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should call widgets seeder', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockWidgetsSeeder.seed.mockResolvedValueOnce(undefined);
      await service.seed();
      expect(mockWidgetsSeeder.seed).toHaveBeenCalledTimes(1);
      consoleSpy.mockRestore();
    });
  });
});
