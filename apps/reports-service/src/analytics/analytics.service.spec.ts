import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { AnalyticsService } from './';
import { AnalyticsData } from './entities';
import {
  AnalyticsMetric,
  AnalyticsDataDto,
  CreateAnalyticsDataDto,
  UpdateAnalyticsDataDto,
  FindAnalyticsFilterDto,
} from '@app/contracts/reports-service';

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    distinctOn: jest.fn().mockReturnThis(),
    getRawMany: jest.fn(),
    getRawOne: jest.fn(),
  };

  const mockRepository: Record<string, jest.Mock> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockAnalyticsData: AnalyticsDataDto = {
    id: 1,
    metric: AnalyticsMetric.OCCUPANCY_RATE,
    value: 85.5,
    date: new Date('2024-01-15'),
    period: 'Jan-2024',
    metadata: { source: 'manual' },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        {
          provide: getRepositoryToken(AnalyticsData),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
    mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create analytics data', async () => {
      const dto: CreateAnalyticsDataDto = {
        metric: AnalyticsMetric.OCCUPANCY_RATE,
        value: 85.5,
        date: new Date('2024-01-15'),
      };
      mockRepository.create.mockReturnValueOnce(mockAnalyticsData);
      mockRepository.save.mockResolvedValueOnce(mockAnalyticsData);
      const result = await service.create(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockAnalyticsData);
      expect(result).toEqual(mockAnalyticsData);
    });
  });

  describe('findAll', () => {
    it('should return all analytics data with no filters', async () => {
      const filters: FindAnalyticsFilterDto = {};
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: {}, order: { date: 'DESC' } }),
      );
      expect(result).toEqual([mockAnalyticsData]);
    });

    it('should filter by metric type', async () => {
      const filters: FindAnalyticsFilterDto = {
        type: AnalyticsMetric.OCCUPANCY_RATE,
      };
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { metric: AnalyticsMetric.OCCUPANCY_RATE },
        }),
      );
      expect(result).toEqual([mockAnalyticsData]);
    });

    it('should filter by date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      const filters: FindAnalyticsFilterDto = { startDate, endDate };
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should filter by startDate only', async () => {
      const startDate = new Date('2024-01-01');
      const filters: FindAnalyticsFilterDto = { startDate };
      mockRepository.find.mockResolvedValueOnce([]);
      await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should filter by endDate only', async () => {
      const endDate = new Date('2024-01-31');
      const filters: FindAnalyticsFilterDto = { endDate };
      mockRepository.find.mockResolvedValueOnce([]);
      await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return analytics data by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockAnalyticsData);
      const result = await service.findOne(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockAnalyticsData);
    });

    it('should throw RpcException when not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update analytics data', async () => {
      const data: UpdateAnalyticsDataDto = { value: 90 };
      const updated = { ...mockAnalyticsData, value: 90 };
      mockRepository.findOne.mockResolvedValueOnce(mockAnalyticsData);
      mockRepository.create.mockReturnValueOnce(mockAnalyticsData);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, data);
      expect(result.value).toBe(90);
    });
  });

  describe('remove', () => {
    it('should remove analytics data', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockAnalyticsData);
      mockRepository.create.mockReturnValueOnce(mockAnalyticsData);
      mockRepository.remove.mockResolvedValueOnce(mockAnalyticsData);
      const result = await service.remove(1);
      expect(result).toEqual(mockAnalyticsData);
    });
  });

  describe('recordMetric', () => {
    it('should record a metric with provided date', async () => {
      const date = new Date('2024-01-15');
      mockRepository.create.mockReturnValueOnce(mockAnalyticsData);
      mockRepository.save.mockResolvedValueOnce(mockAnalyticsData);
      const result = await service.recordMetric(
        AnalyticsMetric.OCCUPANCY_RATE,
        85.5,
        date,
      );
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metric: AnalyticsMetric.OCCUPANCY_RATE,
          value: 85.5,
          date,
        }),
      );
      expect(result).toEqual(mockAnalyticsData);
    });

    it('should record a metric with default date when not provided', async () => {
      mockRepository.create.mockReturnValueOnce(mockAnalyticsData);
      mockRepository.save.mockResolvedValueOnce(mockAnalyticsData);
      await service.recordMetric(AnalyticsMetric.STAFF_EFFICIENCY, 92);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          metric: AnalyticsMetric.STAFF_EFFICIENCY,
          value: 92,
        }),
      );
    });
  });

  describe('findByType', () => {
    it('should find analytics data by metric type and date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.findByType(
        AnalyticsMetric.OCCUPANCY_RATE,
        startDate,
        endDate,
      );
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('findByDateRange', () => {
    it('should find analytics data by date range', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.findByDateRange(startDate, endDate);
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('getLatestMetrics', () => {
    it('should return latest metrics using query builder', async () => {
      const rawResults = [
        {
          metric: AnalyticsMetric.OCCUPANCY_RATE,
          value: '85.5',
          date: new Date('2024-01-15'),
        },
        {
          metric: AnalyticsMetric.REVENUE_PER_ROOM,
          value: '120.0',
          date: new Date('2024-01-15'),
        },
      ];
      mockQueryBuilder.getRawMany.mockResolvedValueOnce(rawResults);
      const result = await service.getLatestMetrics();
      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith(
        'analytics',
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        'analytics.metric',
        'metric',
      );
      expect(mockQueryBuilder.addSelect).toHaveBeenCalledWith(
        'analytics.value',
        'value',
      );
      expect(mockQueryBuilder.distinctOn).toHaveBeenCalledWith([
        'analytics.metric',
      ]);
      expect(result).toHaveLength(2);
      expect(result[0].metric).toBe(AnalyticsMetric.OCCUPANCY_RATE);
      expect(result[0].value).toBe(85.5);
    });

    it('should handle invalid numeric values gracefully', async () => {
      const rawResults = [
        {
          metric: AnalyticsMetric.OCCUPANCY_RATE,
          value: 'invalid',
          date: new Date(),
        },
      ];
      mockQueryBuilder.getRawMany.mockResolvedValueOnce(rawResults);
      const result = await service.getLatestMetrics();
      expect(result[0].value).toBe(0);
    });
  });

  describe('getMetricAverages', () => {
    it('should return the average for a metric', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ average: '85.5' });
      const result = await service.getMetricAverages(
        AnalyticsMetric.OCCUPANCY_RATE,
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        'AVG(analytics.value)',
        'average',
      );
      expect(result).toBe(85.5);
    });

    it('should return 0 when no result', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce(null);
      const result = await service.getMetricAverages(
        AnalyticsMetric.OCCUPANCY_RATE,
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );
      expect(result).toBe(0);
    });
  });

  describe('getMetricTotals', () => {
    it('should return the total for a metric', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce({ total: '2550.0' });
      const result = await service.getMetricTotals(
        AnalyticsMetric.REVENUE_PER_ROOM,
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(
        'SUM(analytics.value)',
        'total',
      );
      expect(result).toBe(2550);
    });

    it('should return 0 when no result', async () => {
      mockQueryBuilder.getRawOne.mockResolvedValueOnce(null);
      const result = await service.getMetricTotals(
        AnalyticsMetric.REVENUE_PER_ROOM,
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );
      expect(result).toBe(0);
    });
  });

  describe('getMetricTrend', () => {
    it('should return metric trend for specified days', async () => {
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.getMetricTrend(
        AnalyticsMetric.OCCUPANCY_RATE,
        30,
      );
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('getDashboardSummary', () => {
    it('should return dashboard summary from latest metrics', async () => {
      const rawResults = [
        {
          metric: AnalyticsMetric.OCCUPANCY_RATE,
          value: '85.5',
          date: new Date(),
        },
        {
          metric: AnalyticsMetric.REVENUE_PER_ROOM,
          value: '120',
          date: new Date(),
        },
        {
          metric: AnalyticsMetric.CUSTOMER_SATISFACTION,
          value: '4.5',
          date: new Date(),
        },
        {
          metric: AnalyticsMetric.AVERAGE_STAY_LENGTH,
          value: '3.2',
          date: new Date(),
        },
        {
          metric: AnalyticsMetric.REPEAT_CUSTOMER_RATE,
          value: '32',
          date: new Date(),
        },
        {
          metric: AnalyticsMetric.STAFF_EFFICIENCY,
          value: '88',
          date: new Date(),
        },
      ];
      mockQueryBuilder.getRawMany.mockResolvedValueOnce(rawResults);
      const result = await service.getDashboardSummary();
      expect(result.OCCUPANCY_RATE).toBe(85.5);
      expect(result.REVENUE_PER_ROOM).toBe(120);
      expect(result.CUSTOMER_SATISFACTION).toBe(4.5);
      expect(result.AVERAGE_STAY_LENGTH).toBe(3.2);
      expect(result.REPEAT_CUSTOMER_RATE).toBe(32);
      expect(result.STAFF_EFFICIENCY).toBe(88);
    });

    it('should return empty summary when no metrics exist', async () => {
      mockQueryBuilder.getRawMany.mockResolvedValueOnce([]);
      const result = await service.getDashboardSummary();
      expect(result.OCCUPANCY_RATE).toBeUndefined();
    });
  });

  describe('getOccupancyData', () => {
    it('should return occupancy data with provided dates', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.getOccupancyData(startDate, endDate);
      expect(result).toEqual([mockAnalyticsData]);
    });

    it('should use default dates when not provided', async () => {
      mockRepository.find.mockResolvedValueOnce([]);
      const result = await service.getOccupancyData();
      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getRevenueData', () => {
    it('should return revenue data with provided dates', async () => {
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.getRevenueData(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );
      expect(result).toEqual([mockAnalyticsData]);
    });

    it('should use default dates when not provided', async () => {
      mockRepository.find.mockResolvedValueOnce([]);
      await service.getRevenueData();
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('getGuestTypeData', () => {
    it('should return guest type data for last 30 days', async () => {
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.getGuestTypeData();
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('getSatisfactionData', () => {
    it('should return satisfaction data with provided dates', async () => {
      mockRepository.find.mockResolvedValueOnce([mockAnalyticsData]);
      const result = await service.getSatisfactionData(
        new Date('2024-01-01'),
        new Date('2024-01-31'),
      );
      expect(result).toEqual([mockAnalyticsData]);
    });

    it('should use default dates when not provided', async () => {
      mockRepository.find.mockResolvedValueOnce([]);
      await service.getSatisfactionData();
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });
});
