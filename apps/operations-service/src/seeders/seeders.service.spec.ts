import { Test, TestingModule } from '@nestjs/testing';
import { SeedersService } from './';
import { CleaningTasksSeeder } from '../cleaning-tasks';
import { CleaningAssignmentsSeeder } from '../cleaning-assignments';
import { MaintenanceReportsSeeder } from '../maintenance-reports';
import { MaintenanceRequestsSeeder } from '../maintenance-requests';
import { MaintenanceSeeder } from '../maintenance';

describe('SeedersService', () => {
  let service: SeedersService;

  const mockCleaningTasksSeeder = { seed: jest.fn() };
  const mockCleaningAssignmentsSeeder = { seed: jest.fn() };
  const mockMaintenanceReportsSeeder = { seed: jest.fn() };
  const mockMaintenanceRequestsSeeder = { seed: jest.fn() };
  const mockMaintenanceSeeder = { seed: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SeedersService,
        { provide: CleaningTasksSeeder, useValue: mockCleaningTasksSeeder },
        {
          provide: CleaningAssignmentsSeeder,
          useValue: mockCleaningAssignmentsSeeder,
        },
        {
          provide: MaintenanceReportsSeeder,
          useValue: mockMaintenanceReportsSeeder,
        },
        {
          provide: MaintenanceRequestsSeeder,
          useValue: mockMaintenanceRequestsSeeder,
        },
        { provide: MaintenanceSeeder, useValue: mockMaintenanceSeeder },
      ],
    }).compile();

    service = module.get<SeedersService>(SeedersService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call all seeders in order', async () => {
    mockCleaningTasksSeeder.seed.mockResolvedValueOnce(undefined);
    mockCleaningAssignmentsSeeder.seed.mockResolvedValueOnce(undefined);
    mockMaintenanceReportsSeeder.seed.mockResolvedValueOnce(undefined);
    mockMaintenanceRequestsSeeder.seed.mockResolvedValueOnce(undefined);
    mockMaintenanceSeeder.seed.mockResolvedValueOnce(undefined);

    await service.seed();

    expect(mockCleaningTasksSeeder.seed).toHaveBeenCalledTimes(1);
    expect(mockCleaningAssignmentsSeeder.seed).toHaveBeenCalledTimes(1);
    expect(mockMaintenanceReportsSeeder.seed).toHaveBeenCalledTimes(1);
    expect(mockMaintenanceRequestsSeeder.seed).toHaveBeenCalledTimes(1);
    expect(mockMaintenanceSeeder.seed).toHaveBeenCalledTimes(1);
  });
});
