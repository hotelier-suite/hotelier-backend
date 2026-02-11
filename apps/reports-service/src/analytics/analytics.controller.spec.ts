import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController, AnalyticsService } from './';
import {
  AnalyticsMetric,
  AnalyticsDataDto,
  CreateAnalyticsDataDto,
  UpdateAnalyticsDataDto,
  DashboardSummaryResponseDto,
  FindAnalyticsFilterDto,
} from '@app/contracts/reports-service';

describe('AnalyticsController', () => {
  let controller: AnalyticsController;
  let service: AnalyticsService;

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

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getDashboardSummary: jest.fn(),
    getOccupancyData: jest.fn(),
    getRevenueData: jest.fn(),
    getGuestTypeData: jest.fn(),
    getSatisfactionData: jest.fn(),
    getMetricTotals: jest.fn(),
    getMetricAverages: jest.fn(),
    getMetricTrend: jest.fn(),
    recordMetric: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: mockService }],
    }).compile();

    controller = module.get<AnalyticsController>(AnalyticsController);
    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create analytics data', async () => {
      const dto: CreateAnalyticsDataDto = {
        metric: AnalyticsMetric.OCCUPANCY_RATE,
        value: 85.5,
        date: new Date('2024-01-15'),
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockAnalyticsData);
      const result = await controller.create(dto);
      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockAnalyticsData);
    });
  });

  describe('findAll', () => {
    it('should return all analytics data', async () => {
      const filters: FindAnalyticsFilterDto = {};
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockAnalyticsData]);
      const result = await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('findOne', () => {
    it('should return analytics data by id', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockAnalyticsData);
      const result = await controller.findOne(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAnalyticsData);
    });
  });

  describe('update', () => {
    it('should update analytics data', async () => {
      const data: UpdateAnalyticsDataDto = { value: 90 };
      const updated = { ...mockAnalyticsData, value: 90 };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data });
      expect(spy).toHaveBeenCalledWith(1, data);
      expect(result.value).toBe(90);
    });
  });

  describe('remove', () => {
    it('should remove analytics data', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockAnalyticsData);
      const result = await controller.remove(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockAnalyticsData);
    });
  });

  describe('getDashboardSummary', () => {
    it('should return dashboard summary', async () => {
      const summary: DashboardSummaryResponseDto = {
        OCCUPANCY_RATE: 85.5,
        REVENUE_PER_ROOM: 120,
      };
      const spy = jest
        .spyOn(service, 'getDashboardSummary')
        .mockResolvedValueOnce(summary);
      const result = await controller.getDashboardSummary();
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(summary);
    });
  });

  describe('getOccupancyData', () => {
    it('should return occupancy data', async () => {
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      const spy = jest
        .spyOn(service, 'getOccupancyData')
        .mockResolvedValueOnce([mockAnalyticsData]);
      const result = await controller.getOccupancyData(payload);
      expect(spy).toHaveBeenCalledWith(payload.startDate, payload.endDate);
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('getRevenueData', () => {
    it('should return revenue data', async () => {
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      const spy = jest
        .spyOn(service, 'getRevenueData')
        .mockResolvedValueOnce([mockAnalyticsData]);
      const result = await controller.getRevenueData(payload);
      expect(spy).toHaveBeenCalledWith(payload.startDate, payload.endDate);
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('getGuestTypeData', () => {
    it('should return guest type data', async () => {
      const spy = jest
        .spyOn(service, 'getGuestTypeData')
        .mockResolvedValueOnce([mockAnalyticsData]);
      const result = await controller.getGuestTypeData();
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('getSatisfactionData', () => {
    it('should return satisfaction data', async () => {
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      const spy = jest
        .spyOn(service, 'getSatisfactionData')
        .mockResolvedValueOnce([mockAnalyticsData]);
      const result = await controller.getSatisfactionData(payload);
      expect(spy).toHaveBeenCalledWith(payload.startDate, payload.endDate);
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('getMetricTotals', () => {
    it('should return metric totals', async () => {
      const payload = {
        metric: AnalyticsMetric.OCCUPANCY_RATE,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      const spy = jest
        .spyOn(service, 'getMetricTotals')
        .mockResolvedValueOnce(2500);
      const result = await controller.getMetricTotals(payload);
      expect(spy).toHaveBeenCalledWith(
        payload.metric,
        payload.startDate,
        payload.endDate,
      );
      expect(result).toBe(2500);
    });
  });

  describe('getMetricAverages', () => {
    it('should return metric averages', async () => {
      const payload = {
        metric: AnalyticsMetric.REVENUE_PER_ROOM,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      const spy = jest
        .spyOn(service, 'getMetricAverages')
        .mockResolvedValueOnce(125);
      const result = await controller.getMetricAverages(payload);
      expect(spy).toHaveBeenCalledWith(
        payload.metric,
        payload.startDate,
        payload.endDate,
      );
      expect(result).toBe(125);
    });
  });

  describe('getMetricTrend', () => {
    it('should return metric trend', async () => {
      const payload = { metric: AnalyticsMetric.OCCUPANCY_RATE, days: 30 };
      const spy = jest
        .spyOn(service, 'getMetricTrend')
        .mockResolvedValueOnce([mockAnalyticsData]);
      const result = await controller.getMetricTrend(payload);
      expect(spy).toHaveBeenCalledWith(payload.metric, payload.days);
      expect(result).toEqual([mockAnalyticsData]);
    });
  });

  describe('recordMetric', () => {
    it('should record a metric', async () => {
      const payload = {
        metric: AnalyticsMetric.STAFF_EFFICIENCY,
        value: 92,
        date: new Date('2024-01-15'),
      };
      const spy = jest
        .spyOn(service, 'recordMetric')
        .mockResolvedValueOnce(mockAnalyticsData);
      const result = await controller.recordMetric(payload);
      expect(spy).toHaveBeenCalledWith(
        payload.metric,
        payload.value,
        payload.date,
      );
      expect(result).toEqual(mockAnalyticsData);
    });
  });
});
