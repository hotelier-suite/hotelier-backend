import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { Configuration } from '../configuration';

describe('SeedersService', () => {
  let service: SeedersService;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        SeedersService,
        {
          provide: getRepositoryToken(Configuration),
          useValue: repo,
        },
      ],
    }).compile();

    service = module.get(SeedersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('seed', () => {
    it('should create all default config entries when none exist', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.save.mockResolvedValue({});

      await service.seed();

      expect(repo.save).toHaveBeenCalled();
      expect(repo.save.mock.calls.length).toBeGreaterThanOrEqual(15);
    });

    it('should not overwrite existing config entries', async () => {
      repo.findOne.mockResolvedValue({ id: 1, value: 'existing' });

      await service.seed();

      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should create only missing entries when some exist', async () => {
      // First call returns existing, rest return null
      repo.findOne
        .mockResolvedValueOnce({ id: 1, value: 'existing' })
        .mockResolvedValue(null);
      repo.save.mockResolvedValue({});

      await service.seed();

      // Should have saved all entries minus the one that existed
      const totalFindCalls = repo.findOne.mock.calls.length;
      expect(repo.save.mock.calls.length).toBe(totalFindCalls - 1);
    });

    it('should seed hotel config entries with correct categories', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.save.mockResolvedValue({});

      await service.seed();

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'HOTEL' }),
      );
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'SYSTEM' }),
      );
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ category: 'INTEGRATION' }),
      );
    });

    it('should seed known hotel keys', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.save.mockResolvedValue({});

      await service.seed();

      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'PROPERTY_NAME' }),
      );
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'CHECKIN_TIME' }),
      );
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'CHECKOUT_TIME' }),
      );
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'TIMEZONE' }),
      );
    });
  });
});
