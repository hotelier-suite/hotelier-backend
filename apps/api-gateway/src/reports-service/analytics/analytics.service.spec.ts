import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { AnalyticsService } from './';
import { REPORTS_SERVICE_CLIENT } from '../constants';

describe('AnalyticsService (gateway)', () => {
  let service: AnalyticsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: REPORTS_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<AnalyticsService>(AnalyticsService);
    jest.clearAllMocks();
  });

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should findAll', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should getDashboardSummary', async () => {
    mockClient.send.mockReturnValueOnce(of({ totalRevenue: 1000 }));
    const result = await lastValueFrom(service.getDashboardSummary());
    expect(result).toHaveProperty('totalRevenue');
  });

  it('should getOccupancyData', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getOccupancyData());
    expect(result).toEqual([]);
  });

  it('should getRevenueData', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getRevenueData());
    expect(result).toEqual([]);
  });

  it('should getGuestTypeData', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getGuestTypeData());
    expect(result).toEqual([]);
  });

  it('should getSatisfactionData', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getSatisfactionData());
    expect(result).toEqual([]);
  });

  it('should getMetricTotals', async () => {
    mockClient.send.mockReturnValueOnce(of(42));
    const result = await lastValueFrom(
      service.getMetricTotals('OCCUPANCY' as never, new Date(), new Date()),
    );
    expect(result).toBe(42);
  });

  it('should getMetricAverages', async () => {
    mockClient.send.mockReturnValueOnce(of(35));
    const result = await lastValueFrom(
      service.getMetricAverages('REVENUE' as never, new Date(), new Date()),
    );
    expect(result).toBe(35);
  });

  it('should getMetricTrend', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(
      service.getMetricTrend('OCCUPANCY' as never, 30),
    );
    expect(result).toEqual([]);
  });

  it('should recordMetric', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      service.recordMetric('REVENUE' as never, 100),
    );
    expect(result).toHaveProperty('id');
  });
});
