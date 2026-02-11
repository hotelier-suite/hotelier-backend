import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeesSeeder, Employee } from '../';

describe('EmployeesSeeder', () => {
  let seeder: EmployeesSeeder;
  const mockRepository: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeesSeeder,
        { provide: getRepositoryToken(Employee), useValue: mockRepository },
      ],
    }).compile();

    seeder = module.get<EmployeesSeeder>(EmployeesSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should seed employees when they do not exist', async () => {
    mockRepository.findOne.mockResolvedValue(null);
    mockRepository.save.mockResolvedValue({});
    await seeder.seed();
    expect(mockRepository.save).toHaveBeenCalled();
  });

  it('should skip existing employees', async () => {
    mockRepository.findOne.mockResolvedValue({ id: 1 });
    await seeder.seed();
    expect(mockRepository.save).not.toHaveBeenCalled();
  });
});
