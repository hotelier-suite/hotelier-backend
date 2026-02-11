import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WidgetsSeeder } from './';
import { DashboardWidget } from '../../widgets';

describe('WidgetsSeeder', () => {
  let seeder: WidgetsSeeder;

  const mockRepository: Record<string, jest.Mock> = {
    count: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WidgetsSeeder,
        {
          provide: getRepositoryToken(DashboardWidget),
          useValue: mockRepository,
        },
      ],
    }).compile();

    seeder = module.get<WidgetsSeeder>(WidgetsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should skip when widgets already exist', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockRepository.count.mockResolvedValueOnce(6);
      await seeder.seed();
      expect(mockRepository.save).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should seed widgets when count is 0', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      mockRepository.count.mockResolvedValueOnce(0);
      mockRepository.save.mockResolvedValueOnce([]);
      await seeder.seed();
      expect(mockRepository.save).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });
});
