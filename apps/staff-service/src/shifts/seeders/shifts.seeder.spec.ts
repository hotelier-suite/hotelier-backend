import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShiftsSeeder, Shift } from '../';
import { Employee } from '../../employees';

describe('ShiftsSeeder', () => {
  let seeder: ShiftsSeeder;
  const mockShiftRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const mockEmployeeRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShiftsSeeder,
        { provide: getRepositoryToken(Shift), useValue: mockShiftRepo },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepo },
      ],
    }).compile();

    seeder = module.get<ShiftsSeeder>(ShiftsSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should skip when no employees', async () => {
    mockEmployeeRepo.find.mockResolvedValueOnce([]);
    await seeder.seed();
    expect(mockShiftRepo.save).not.toHaveBeenCalled();
  });

  it('should seed shifts when they do not exist', async () => {
    const employees = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ];
    mockEmployeeRepo.find.mockResolvedValueOnce(employees);
    mockShiftRepo.findOne.mockResolvedValue(null);
    mockShiftRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockShiftRepo.save).toHaveBeenCalledTimes(10);
  });

  it('should skip existing shifts', async () => {
    mockEmployeeRepo.find.mockResolvedValueOnce([{ id: 1 }]);
    mockShiftRepo.findOne.mockResolvedValue({ id: 1 });

    await seeder.seed();

    expect(mockShiftRepo.save).not.toHaveBeenCalled();
  });
});
