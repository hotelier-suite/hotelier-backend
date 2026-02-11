import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './';
import {
  RecreationalFacilitiesSeeder,
  RecreationalBookingsSeeder,
} from './domains';

describe('SeedersService', () => {
  let service: SeedersService;

  const mockFacilitiesSeeder = {
    seed: jest.fn(),
  };

  const mockBookingsSeeder = {
    seed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        {
          provide: RecreationalFacilitiesSeeder,
          useValue: mockFacilitiesSeeder,
        },
        { provide: RecreationalBookingsSeeder, useValue: mockBookingsSeeder },
      ],
    }).compile();

    service = module.get<SeedersService>(SeedersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should call all seeders in order', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockFacilitiesSeeder.seed.mockResolvedValueOnce(undefined);
      mockBookingsSeeder.seed.mockResolvedValueOnce(undefined);
      await service.seed();
      expect(mockFacilitiesSeeder.seed).toHaveBeenCalledTimes(1);
      expect(mockBookingsSeeder.seed).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
