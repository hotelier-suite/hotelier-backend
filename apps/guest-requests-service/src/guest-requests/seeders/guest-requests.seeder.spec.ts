import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { GuestRequestsSeeder } from './guest-requests.seeder';
import { GuestRequest } from '../entities';

describe('GuestRequestsSeeder', () => {
  let seeder: GuestRequestsSeeder;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        GuestRequestsSeeder,
        {
          provide: getRepositoryToken(GuestRequest),
          useValue: repo,
        },
      ],
    }).compile();

    seeder = module.get(GuestRequestsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  describe('seed', () => {
    it('should create all seed entries when none exist', async () => {
      repo.findOne.mockResolvedValue(null);
      repo.save.mockResolvedValue({});

      await seeder.seed();

      expect(repo.save).toHaveBeenCalled();
      expect(repo.save.mock.calls.length).toBe(10);
    });

    it('should not overwrite existing entries', async () => {
      repo.findOne.mockResolvedValue({ id: 1 });

      await seeder.seed();

      expect(repo.save).not.toHaveBeenCalled();
    });

    it('should only create missing entries', async () => {
      repo.findOne.mockResolvedValueOnce({ id: 1 }).mockResolvedValue(null);
      repo.save.mockResolvedValue({});

      await seeder.seed();

      expect(repo.save.mock.calls.length).toBe(9);
    });
  });
});
