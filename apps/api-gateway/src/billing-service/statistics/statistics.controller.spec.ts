import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { StatisticsController } from './';
import { StatisticsService } from './statistics.service';

describe('StatisticsController (billing gateway)', () => {
  let controller: StatisticsController;
  const mockService: Record<string, jest.Mock> = {
    getYearToDateFinancialSummary: jest.fn(),
    getPaymentStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [{ provide: StatisticsService, useValue: mockService }],
    }).compile();
    controller = module.get<StatisticsController>(StatisticsController);
    jest.clearAllMocks();
  });

  it('should getYearToDateFinancialSummary', async () => {
    mockService.getYearToDateFinancialSummary.mockReturnValueOnce(
      of({ total: 1000 }),
    );
    const result = await lastValueFrom(
      controller.getYearToDateFinancialSummary(),
    );
    expect(result).toHaveProperty('total');
  });

  it('should getPaymentStatistics', async () => {
    mockService.getPaymentStatistics.mockReturnValueOnce(of({ count: 5 }));
    const result = await lastValueFrom(controller.getPaymentStatistics());
    expect(result).toHaveProperty('count');
  });
});
