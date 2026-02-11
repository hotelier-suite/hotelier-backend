import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { AnalyticsController } from './';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController (gateway)', () => {
  let controller: AnalyticsController;
  const mockService: Record<string, jest.Mock> = {
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
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [{ provide: AnalyticsService, useValue: mockService }],
    }).compile();
    controller = module.get<AnalyticsController>(AnalyticsController);
    jest.clearAllMocks();
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should findAll', async () => {
    mockService.findAll.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockService.update.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockService.remove.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should getDashboardSummary', async () => {
    mockService.getDashboardSummary.mockReturnValueOnce(of({ total: 10 }));
    const result = await lastValueFrom(controller.getDashboardSummary());
    expect(result).toHaveProperty('total');
  });

  it('should getOccupancyData', async () => {
    mockService.getOccupancyData.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getOccupancyData());
    expect(result).toEqual([]);
  });

  it('should getRevenueData', async () => {
    mockService.getRevenueData.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getRevenueData());
    expect(result).toEqual([]);
  });

  it('should getGuestTypeData', async () => {
    mockService.getGuestTypeData.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getGuestTypeData());
    expect(result).toEqual([]);
  });

  it('should getSatisfactionData', async () => {
    mockService.getSatisfactionData.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.getSatisfactionData());
    expect(result).toEqual([]);
  });
});
