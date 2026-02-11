import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { StatisticsController } from './';
import { StatisticsService } from './statistics.service';

describe('StatisticsController (gateway)', () => {
  let controller: StatisticsController;
  const mockService: Record<string, jest.Mock> = {
    getStatistics: jest.fn(),
    getCleaningPerformance: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [{ provide: StatisticsService, useValue: mockService }],
    }).compile();
    controller = module.get<StatisticsController>(StatisticsController);
    jest.clearAllMocks();
  });

  it('should getStatistics', async () => {
    mockService.getStatistics.mockReturnValueOnce(of({ total: 10 }));
    const result = await lastValueFrom(controller.getStatistics());
    expect(result).toHaveProperty('total');
  });

  it('should getCleaningPerformance without employeeId', async () => {
    mockService.getCleaningPerformance.mockReturnValueOnce(of({ score: 95 }));
    const result = await lastValueFrom(controller.getCleaningPerformance());
    expect(result).toHaveProperty('score');
  });

  it('should getCleaningPerformance with employeeId', async () => {
    mockService.getCleaningPerformance.mockReturnValueOnce(of({ score: 90 }));
    const result = await lastValueFrom(controller.getCleaningPerformance(1));
    expect(result).toHaveProperty('score');
  });
});
