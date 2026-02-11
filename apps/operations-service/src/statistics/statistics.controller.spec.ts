import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController, StatisticsService } from './';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;

  const mockStatistics = {
    pendingMaintenanceReports: 5,
    inProgressMaintenanceReports: 3,
    completedMaintenanceReports: 12,
    pendingCleaningAssignments: 8,
    inProgressCleaningAssignments: 4,
    completedCleaningAssignments: 15,
    todaysMaintenanceReports: [],
    todaysCleaningAssignments: [],
  };

  const mockPerformance = {
    averageQualityScore: 8.7,
    completionRate: 92.5,
    employeePerformance: [
      { employeeId: 1, completedAssignments: 10, averageQualityScore: 9.2 },
    ],
  };

  const mockService = {
    getStatistics: jest.fn(),
    getCleaningPerformance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [{ provide: StatisticsService, useValue: mockService }],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);
    service = module.get<StatisticsService>(StatisticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getStatistics', () => {
    it('should return housekeeping statistics', async () => {
      const spy = jest
        .spyOn(service, 'getStatistics')
        .mockResolvedValueOnce(mockStatistics);
      const result = await controller.getStatistics();
      expect(result).toEqual(mockStatistics);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getCleaningPerformance', () => {
    it('should return cleaning performance without employeeId', async () => {
      const spy = jest
        .spyOn(service, 'getCleaningPerformance')
        .mockResolvedValueOnce(mockPerformance);
      const result = await controller.getCleaningPerformance(undefined);
      expect(result).toEqual(mockPerformance);
      expect(spy).toHaveBeenCalledWith(undefined);
    });

    it('should return cleaning performance for a specific employee', async () => {
      const spy = jest
        .spyOn(service, 'getCleaningPerformance')
        .mockResolvedValueOnce(mockPerformance);
      const result = await controller.getCleaningPerformance(1);
      expect(result).toEqual(mockPerformance);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
