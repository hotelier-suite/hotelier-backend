import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { StatisticsService } from './';
import { DASHBOARD_SERVICE_CLIENT } from '../constants';

describe('StatisticsService (gateway)', () => {
  let service: StatisticsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: DASHBOARD_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<StatisticsService>(StatisticsService);
    jest.clearAllMocks();
  });

  it('should getStats', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.getStats(1));
    expect(result).toHaveProperty('id');
  });

  it('should getOccupancy', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getOccupancy());
    expect(result).toEqual([]);
  });

  it('should getRevenue', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getRevenue(1));
    expect(result).toEqual([]);
  });

  it('should getTopRooms', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getTopRooms());
    expect(result).toEqual([]);
  });

  it('should getRecentActivities', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getRecentActivities(1));
    expect(result).toEqual([]);
  });
});
