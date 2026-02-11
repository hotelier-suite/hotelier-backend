import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RoomsSeeder, Room } from '../';

describe('RoomsSeeder', () => {
  let seeder: RoomsSeeder;
  const mockRepository: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RoomsSeeder,
        { provide: getRepositoryToken(Room), useValue: mockRepository },
      ],
    }).compile();

    seeder = module.get<RoomsSeeder>(RoomsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed rooms when they do not exist', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue({});

    await seeder.seed();

    // 10 individual + 20 double + 5 suite + 10 family = 45 rooms
    expect(mockRepository.findOne).toHaveBeenCalledTimes(45);
    expect(mockRepository.save).toHaveBeenCalledTimes(45);
  });

  it('should skip seeding when rooms already exist', async () => {
    mockRepository.findOne.mockResolvedValue({ id: 1 });

    await seeder.seed();

    expect(mockRepository.findOne).toHaveBeenCalledTimes(45);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should seed only missing rooms', async () => {
    // First room exists, rest don't
    mockRepository.findOne
      .mockResolvedValueOnce({ id: 1 })
      .mockResolvedValue(null);
    mockRepository.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockRepository.save).toHaveBeenCalledTimes(44);
  });
});
