import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CleaningAssignmentsSeeder } from './';
import { CleaningAssignment } from '../entities';

describe('CleaningAssignmentsSeeder', () => {
  let seeder: CleaningAssignmentsSeeder;
  const mockRepository: Record<string, jest.Mock> = {
    count: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CleaningAssignmentsSeeder,
        {
          provide: getRepositoryToken(CleaningAssignment),
          useValue: mockRepository,
        },
      ],
    }).compile();

    seeder = module.get<CleaningAssignmentsSeeder>(CleaningAssignmentsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should skip seeding when data already exists', async () => {
    mockRepository.count.mockResolvedValueOnce(5);
    await seeder.seed();
    expect(mockRepository.count).toHaveBeenCalled();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should seed data when table is empty', async () => {
    mockRepository.count.mockResolvedValueOnce(0);
    mockRepository.save.mockResolvedValue({});
    await seeder.seed();
    expect(mockRepository.count).toHaveBeenCalled();
    expect(mockRepository.save).toHaveBeenCalledTimes(5);
  });
});
