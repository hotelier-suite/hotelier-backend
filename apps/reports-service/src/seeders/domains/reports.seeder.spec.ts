import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReportsSeeder } from './';
import { Report } from '../../reports';
import { ReportType } from '@app/contracts/reports-service';

describe('ReportsSeeder', () => {
  let seeder: ReportsSeeder;

  const mockRepository: Record<string, jest.Mock> = {
    count: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsSeeder,
        { provide: getRepositoryToken(Report), useValue: mockRepository },
      ],
    }).compile();

    seeder = module.get<ReportsSeeder>(ReportsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should skip seeding when reports already exist', async () => {
    mockRepository.count.mockResolvedValueOnce(5);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await seeder.seed();
    expect(mockRepository.count).toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
    consoleSpy.mockRestore();
  });

  it('should seed reports when empty', async () => {
    mockRepository.count.mockResolvedValueOnce(0);
    mockRepository.save.mockResolvedValueOnce([]);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    await seeder.seed();
    expect(mockRepository.count).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ type: ReportType.OCCUPANCY }),
        expect.objectContaining({ type: ReportType.REVENUE }),
        expect.objectContaining({ type: ReportType.GUEST_SATISFACTION }),
      ]),
    );
    consoleSpy.mockRestore();
  });
});
