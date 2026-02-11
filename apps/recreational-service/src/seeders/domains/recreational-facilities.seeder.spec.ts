import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RecreationalFacilitiesSeeder } from './';
import { RecreationalFacility } from '../../facilities';

describe('RecreationalFacilitiesSeeder', () => {
  let seeder: RecreationalFacilitiesSeeder;

  const mockFacilityRepository: Record<string, jest.Mock> = {
    count: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecreationalFacilitiesSeeder,
        {
          provide: getRepositoryToken(RecreationalFacility),
          useValue: mockFacilityRepository,
        },
      ],
    }).compile();

    seeder = module.get<RecreationalFacilitiesSeeder>(
      RecreationalFacilitiesSeeder,
    );
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should skip seeding when facilities already exist', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockFacilityRepository.count.mockResolvedValueOnce(5);
      await seeder.seed();
      expect(mockFacilityRepository.save).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should seed facilities when count is 0', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockFacilityRepository.count.mockResolvedValueOnce(0);
      mockFacilityRepository.save.mockResolvedValue({ id: 1 });
      await seeder.seed();
      expect(mockFacilityRepository.save).toHaveBeenCalled();
      const callCount = mockFacilityRepository.save.mock.calls.length;
      expect(callCount).toBeGreaterThan(0);
      consoleSpy.mockRestore();
    });
  });
});
