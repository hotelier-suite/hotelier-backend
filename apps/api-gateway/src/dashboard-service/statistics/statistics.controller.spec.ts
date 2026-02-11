import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { StatisticsController } from './';
import { StatisticsService } from './statistics.service';

describe('StatisticsController (gateway)', () => {
  let controller: StatisticsController;
  const mockService: Record<string, jest.Mock> = {
    getStats: jest.fn(),
    getOccupancy: jest.fn(),
    getRevenue: jest.fn(),
    getTopRooms: jest.fn(),
    getRecentActivities: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [{ provide: StatisticsService, useValue: mockService }],
    }).compile();
    controller = module.get<StatisticsController>(StatisticsController);
    jest.clearAllMocks();
  });

  it('should getStats', async () => {
    mockService.getStats.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.getStats(1));
    expect(result).toHaveProperty('id');
  });

  it('should getOccupancy', async () => {
    mockService.getOccupancy.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getOccupancy());
    expect(result).toEqual([]);
  });

  it('should getRevenue', async () => {
    mockService.getRevenue.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getRevenue(1));
    expect(result).toEqual([]);
  });

  it('should getTopRooms', async () => {
    mockService.getTopRooms.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getTopRooms());
    expect(result).toEqual([]);
  });

  it('should getRecentActivities', async () => {
    mockService.getRecentActivities.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getRecentActivities(1));
    expect(result).toEqual([]);
  });
});
