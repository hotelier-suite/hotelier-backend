import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatisticsService } from './';
import { CleaningAssignment } from '../cleaning-assignments/entities';
import { MaintenanceReport } from '../maintenance-reports/entities';
import {
  CleaningStatus,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';

describe('StatisticsService', () => {
  let service: StatisticsService;
  const mockCleaningRepo: Record<string, jest.Mock> = {
    count: jest.fn(),
    find: jest.fn(),
  };
  const mockMaintenanceRepo: Record<string, jest.Mock> = {
    count: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: getRepositoryToken(CleaningAssignment),
          useValue: mockCleaningRepo,
        },
        {
          provide: getRepositoryToken(MaintenanceReport),
          useValue: mockMaintenanceRepo,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStatistics', () => {
    it('should return complete housekeeping statistics', async () => {
      mockMaintenanceRepo.count
        .mockResolvedValueOnce(5) // pending maintenance
        .mockResolvedValueOnce(3) // in-progress maintenance
        .mockResolvedValueOnce(12); // completed maintenance

      mockCleaningRepo.count
        .mockResolvedValueOnce(8) // pending cleaning
        .mockResolvedValueOnce(4) // in-progress cleaning
        .mockResolvedValueOnce(15); // completed cleaning

      mockMaintenanceRepo.find.mockResolvedValueOnce([]); // today's maintenance
      mockCleaningRepo.find.mockResolvedValueOnce([]); // today's cleaning

      const result = await service.getStatistics();

      expect(result.pendingMaintenanceReports).toBe(5);
      expect(result.inProgressMaintenanceReports).toBe(3);
      expect(result.completedMaintenanceReports).toBe(12);
      expect(result.pendingCleaningAssignments).toBe(8);
      expect(result.inProgressCleaningAssignments).toBe(4);
      expect(result.completedCleaningAssignments).toBe(15);
      expect(result.todaysMaintenanceReports).toEqual([]);
      expect(result.todaysCleaningAssignments).toEqual([]);
    });

    it("should return today's reports and assignments", async () => {
      const todaysReport = {
        id: 1,
        reportNumber: 'MR-001',
        status: HousekeepingMaintenanceStatus.PENDING,
        createdAt: new Date(),
      };
      const todaysAssignment = {
        id: 1,
        status: CleaningStatus.PENDING,
        assignedDate: new Date(),
      };

      mockMaintenanceRepo.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockCleaningRepo.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockMaintenanceRepo.find.mockResolvedValueOnce([todaysReport]);
      mockCleaningRepo.find.mockResolvedValueOnce([todaysAssignment]);

      const result = await service.getStatistics();

      expect(result.todaysMaintenanceReports).toHaveLength(1);
      expect(result.todaysCleaningAssignments).toHaveLength(1);
    });

    it('should pass correct status filters to count queries', async () => {
      mockMaintenanceRepo.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockCleaningRepo.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockMaintenanceRepo.find.mockResolvedValueOnce([]);
      mockCleaningRepo.find.mockResolvedValueOnce([]);

      await service.getStatistics();

      expect(mockMaintenanceRepo.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: HousekeepingMaintenanceStatus.PENDING },
        }),
      );
      expect(mockMaintenanceRepo.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: HousekeepingMaintenanceStatus.IN_PROGRESS },
        }),
      );
      expect(mockMaintenanceRepo.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: HousekeepingMaintenanceStatus.COMPLETED },
        }),
      );
      expect(mockCleaningRepo.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: CleaningStatus.PENDING },
        }),
      );
      expect(mockCleaningRepo.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: CleaningStatus.IN_PROGRESS },
        }),
      );
      expect(mockCleaningRepo.count).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { status: CleaningStatus.COMPLETED },
        }),
      );
    });
  });

  describe('getCleaningPerformance', () => {
    it('should return performance data without employeeId filter', async () => {
      const completedAssignments = [
        {
          id: 1,
          status: CleaningStatus.COMPLETED,
          employeeId: 1,
          qualityScore: 9.0,
        },
        {
          id: 2,
          status: CleaningStatus.COMPLETED,
          employeeId: 2,
          qualityScore: 8.0,
        },
        {
          id: 3,
          status: CleaningStatus.COMPLETED,
          employeeId: 1,
          qualityScore: 9.5,
        },
      ];

      mockCleaningRepo.find.mockResolvedValueOnce(completedAssignments);
      mockCleaningRepo.count.mockResolvedValueOnce(5); // total assignments

      const result = await service.getCleaningPerformance();

      expect(result.completionRate).toBe(60); // 3/5 * 100
      expect(result.averageQualityScore).toBeCloseTo(8.833, 2);
      expect(result.employeePerformance).toHaveLength(2);
    });

    it('should return performance data for a specific employee', async () => {
      const completedAssignments = [
        {
          id: 1,
          status: CleaningStatus.COMPLETED,
          employeeId: 1,
          qualityScore: 9.0,
        },
        {
          id: 3,
          status: CleaningStatus.COMPLETED,
          employeeId: 1,
          qualityScore: 9.5,
        },
      ];

      mockCleaningRepo.find.mockResolvedValueOnce(completedAssignments);
      mockCleaningRepo.count.mockResolvedValueOnce(4);

      const result = await service.getCleaningPerformance(1);

      expect(result.completionRate).toBe(50); // 2/4 * 100
      expect(result.averageQualityScore).toBeCloseTo(9.25, 2);
      expect(result.employeePerformance).toHaveLength(1);
      expect(result.employeePerformance[0].employeeId).toBe(1);
      expect(result.employeePerformance[0].completedAssignments).toBe(2);
    });

    it('should handle zero assignments gracefully', async () => {
      mockCleaningRepo.find.mockResolvedValueOnce([]);
      mockCleaningRepo.count.mockResolvedValueOnce(0);

      const result = await service.getCleaningPerformance();

      expect(result.completionRate).toBe(0);
      expect(result.averageQualityScore).toBe(0);
      expect(result.employeePerformance).toHaveLength(0);
    });

    it('should handle assignments without qualityScore', async () => {
      const assignments = [
        {
          id: 1,
          status: CleaningStatus.COMPLETED,
          employeeId: 1,
          qualityScore: undefined,
        },
        {
          id: 2,
          status: CleaningStatus.COMPLETED,
          employeeId: 1,
          qualityScore: 8.0,
        },
      ];

      mockCleaningRepo.find.mockResolvedValueOnce(assignments);
      mockCleaningRepo.count.mockResolvedValueOnce(3);

      const result = await service.getCleaningPerformance();

      expect(result.averageQualityScore).toBe(4); // (0 + 8) / 2
      expect(result.employeePerformance).toHaveLength(1);
    });

    it('should skip employees without numeric employeeId', async () => {
      const assignments = [
        {
          id: 1,
          status: CleaningStatus.COMPLETED,
          employeeId: undefined,
          qualityScore: 9.0,
        },
        {
          id: 2,
          status: CleaningStatus.COMPLETED,
          employeeId: 1,
          qualityScore: 8.0,
        },
      ];

      mockCleaningRepo.find.mockResolvedValueOnce(assignments);
      mockCleaningRepo.count.mockResolvedValueOnce(3);

      const result = await service.getCleaningPerformance();

      expect(result.employeePerformance).toHaveLength(1);
      expect(result.employeePerformance[0].employeeId).toBe(1);
    });
  });
});
