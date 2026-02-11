import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { StatisticsService } from './';
import { BILLING_SERVICE_CLIENT } from '../constants';

describe('StatisticsService (billing gateway)', () => {
  let service: StatisticsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: BILLING_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<StatisticsService>(StatisticsService);
    jest.clearAllMocks();
  });

  it('should getYearToDateFinancialSummary', async () => {
    mockClient.send.mockReturnValueOnce(of({ total: 1000 }));
    const result = await lastValueFrom(service.getYearToDateFinancialSummary());
    expect(result).toHaveProperty('total');
  });

  it('should getPaymentStatistics', async () => {
    mockClient.send.mockReturnValueOnce(of({ count: 5 }));
    const result = await lastValueFrom(service.getPaymentStatistics());
    expect(result).toHaveProperty('count');
  });
});
