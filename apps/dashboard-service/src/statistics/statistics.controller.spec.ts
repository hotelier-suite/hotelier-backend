import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController, StatisticsService } from './';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;

  const mockService = {
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
    service = module.get<StatisticsService>(StatisticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should return dashboard stats', async () => {
      const stats = {
        totalRooms: 100,
        occupiedRooms: 75,
        availableRooms: 25,
        totalRevenue: 50000,
        todayCheckIns: 10,
        todayCheckOuts: 8,
        pendingRequests: 5,
        activeStaff: 20,
      };
      const spy = jest.spyOn(service, 'getStats').mockResolvedValueOnce(stats);
      const result = await controller.getStats(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(stats);
    });
  });

  describe('getOccupancy', () => {
    it('should return occupancy data', async () => {
      const data = [{ date: new Date(), occupancy: 85 }];
      const spy = jest
        .spyOn(service, 'getOccupancy')
        .mockResolvedValueOnce(data);
      const result = await controller.getOccupancy();
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(data);
    });
  });

  describe('getRevenue', () => {
    it('should return revenue data', async () => {
      const data = [{ date: new Date(), revenue: 5000 }];
      const spy = jest.spyOn(service, 'getRevenue').mockResolvedValueOnce(data);
      const result = await controller.getRevenue(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(data);
    });
  });

  describe('getTopRooms', () => {
    it('should return top performing rooms', async () => {
      const rooms = [{ room: '101', revenue: 2500, occupancy: 95 }];
      const spy = jest
        .spyOn(service, 'getTopRooms')
        .mockResolvedValueOnce(rooms);
      const result = await controller.getTopRooms();
      expect(spy).toHaveBeenCalled();
      expect(result).toEqual(rooms);
    });
  });

  describe('getRecentActivities', () => {
    it('should return recent activities', async () => {
      const activities = [
        { type: 'booking', description: 'New booking', timestamp: new Date() },
      ];
      const spy = jest
        .spyOn(service, 'getRecentActivities')
        .mockResolvedValueOnce(activities);
      const result = await controller.getRecentActivities(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(activities);
    });
  });
});
