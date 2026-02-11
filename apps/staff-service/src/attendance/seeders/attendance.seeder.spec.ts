import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AttendanceSeeder } from './';
import { Attendance } from '../entities';
import { Employee } from '../../employees';

describe('AttendanceSeeder', () => {
  let seeder: AttendanceSeeder;
  const mockAttendanceRepo: Record<string, jest.Mock> = {
    findOne: jest.fn(),
    save: jest.fn(),
  };
  const mockEmployeeRepo: Record<string, jest.Mock> = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendanceSeeder,
        {
          provide: getRepositoryToken(Attendance),
          useValue: mockAttendanceRepo,
        },
        { provide: getRepositoryToken(Employee), useValue: mockEmployeeRepo },
      ],
    }).compile();

    seeder = module.get<AttendanceSeeder>(AttendanceSeeder);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(seeder).toBeDefined();
  });

  it('should skip seeding when no employees exist', async () => {
    mockEmployeeRepo.find.mockResolvedValueOnce([]);
    await seeder.seed();
    expect(mockAttendanceRepo.save).not.toHaveBeenCalled();
  });

  it('should seed attendance records when employees exist', async () => {
    const employees = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ];
    mockEmployeeRepo.find.mockResolvedValueOnce(employees);
    mockAttendanceRepo.findOne.mockResolvedValue(null);
    mockAttendanceRepo.save.mockResolvedValue({});

    await seeder.seed();

    expect(mockAttendanceRepo.save).toHaveBeenCalledTimes(14);
  });

  it('should skip existing attendance records', async () => {
    const employees = [
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 },
      { id: 5 },
      { id: 6 },
    ];
    mockEmployeeRepo.find.mockResolvedValueOnce(employees);
    mockAttendanceRepo.findOne.mockResolvedValue({ id: 1 });

    await seeder.seed();

    expect(mockAttendanceRepo.save).not.toHaveBeenCalled();
  });
});
