import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuditLogsSeeder } from './audit-logs.seeder';
import { AuditLog } from '../../audit';

describe('AuditLogsSeeder', () => {
  let seeder: AuditLogsSeeder;
  let repo: Record<string, jest.Mock>;

  beforeEach(async () => {
    repo = {
      count: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditLogsSeeder,
        { provide: getRepositoryToken(AuditLog), useValue: repo },
      ],
    }).compile();

    seeder = module.get(AuditLogsSeeder);
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed 10 audit log entries when empty', async () => {
    repo.count.mockResolvedValueOnce(0);
    repo.save.mockImplementation((data) => Promise.resolve(data));

    await seeder.seed();
    expect(repo.count).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalledTimes(10);
  });

  it('should skip seeding when records exist', async () => {
    repo.count.mockResolvedValueOnce(5);

    await seeder.seed();
    expect(repo.count).toHaveBeenCalled();
    expect(repo.save).not.toHaveBeenCalled();
  });
});
