import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './';
import { EmployeesSeeder } from '../employees';
import { ShiftsSeeder } from '../shifts';
import { AttendanceSeeder } from '../attendance';
import { EmployeeRequestsSeeder } from '../employee-requests';

describe('SeedersService', () => {
  let service: SeedersService;
  const mockEmployeesSeeder: Record<string, jest.Mock> = {
    seed: jest.fn(),
  };
  const mockShiftsSeeder: Record<string, jest.Mock> = {
    seed: jest.fn(),
  };
  const mockAttendanceSeeder: Record<string, jest.Mock> = {
    seed: jest.fn(),
  };
  const mockEmployeeRequestsSeeder: Record<string, jest.Mock> = {
    seed: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        { provide: EmployeesSeeder, useValue: mockEmployeesSeeder },
        { provide: ShiftsSeeder, useValue: mockShiftsSeeder },
        { provide: AttendanceSeeder, useValue: mockAttendanceSeeder },
        {
          provide: EmployeeRequestsSeeder,
          useValue: mockEmployeeRequestsSeeder,
        },
      ],
    }).compile();

    service = module.get<SeedersService>(SeedersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all seeders in order', async () => {
    const callOrder: string[] = [];
    mockEmployeesSeeder.seed.mockImplementation(() => {
      callOrder.push('employees');
      return Promise.resolve();
    });
    mockShiftsSeeder.seed.mockImplementation(() => {
      callOrder.push('shifts');
      return Promise.resolve();
    });
    mockAttendanceSeeder.seed.mockImplementation(() => {
      callOrder.push('attendance');
      return Promise.resolve();
    });
    mockEmployeeRequestsSeeder.seed.mockImplementation(() => {
      callOrder.push('employee-requests');
      return Promise.resolve();
    });

    await service.seed();

    expect(callOrder).toEqual([
      'employees',
      'shifts',
      'attendance',
      'employee-requests',
    ]);
  });

  it('should call each seeder exactly once', async () => {
    mockEmployeesSeeder.seed.mockResolvedValueOnce(undefined);
    mockShiftsSeeder.seed.mockResolvedValueOnce(undefined);
    mockAttendanceSeeder.seed.mockResolvedValueOnce(undefined);
    mockEmployeeRequestsSeeder.seed.mockResolvedValueOnce(undefined);

    await service.seed();

    expect(mockEmployeesSeeder.seed).toHaveBeenCalledTimes(1);
    expect(mockShiftsSeeder.seed).toHaveBeenCalledTimes(1);
    expect(mockAttendanceSeeder.seed).toHaveBeenCalledTimes(1);
    expect(mockEmployeeRequestsSeeder.seed).toHaveBeenCalledTimes(1);
  });
});
