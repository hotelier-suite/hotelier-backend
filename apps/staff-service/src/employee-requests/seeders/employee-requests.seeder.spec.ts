import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EmployeeRequestsSeeder } from './';
import { EmployeeRequest } from '../entities';
import { Employee } from '../../employees';

describe('EmployeeRequestsSeeder', () => {
  let seeder: EmployeeRequestsSeeder;
  const mockRequestRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const mockEmployeeRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeRequestsSeeder,
        {
          provide: getRepositoryToken(EmployeeRequest),
          useValue: mockRequestRepo,
        },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepo },
      ],
    }).compile();

    seeder = module.get<EmployeeRequestsSeeder>(EmployeeRequestsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should skip seeding when no employees exist', async () => {
    mockEmployeeRepo.find.mockResolvedValueOnce([]);
    await seeder.seed();
    expect(mockRequestRepo.save).not.toHaveBeenCalled();
  });

  it('should seed 10 request records when employees exist', async () => {
    const employees = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ];
    mockEmployeeRepo.find.mockResolvedValueOnce(employees);
    mockRequestRepo.findOne.mockResolvedValue(null);
    mockRequestRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockRequestRepo.save).toHaveBeenCalledTimes(10);
  });

  it('should skip existing request records', async () => {
    const employees = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ];
    mockEmployeeRepo.find.mockResolvedValueOnce(employees);
    mockRequestRepo.findOne.mockResolvedValue({ id: 1 });

    await seeder.seed();

    expect(mockRequestRepo.save).not.toHaveBeenCalled();
  });
});
