import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { StatisticsService } from './';
import { OPERATIONS_SERVICE_CLIENT } from '../constants';

describe('StatisticsService (gateway)', () => {
  let service: StatisticsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: OPERATIONS_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<StatisticsService>(StatisticsService);
    jest.clearAllMocks();
  });

  it('should getStatistics', async () => {
    mockClient.send.mockReturnValueOnce(of({ total: 10 }));
    const result = await lastValueFrom(service.getStatistics());
    expect(result).toHaveProperty('total');
  });

  it('should getCleaningPerformance without employeeId', async () => {
    mockClient.send.mockReturnValueOnce(of({ score: 95 }));
    const result = await lastValueFrom(service.getCleaningPerformance());
    expect(result).toHaveProperty('score');
  });

  it('should getCleaningPerformance with employeeId', async () => {
    mockClient.send.mockReturnValueOnce(of({ score: 90 }));
    const result = await lastValueFrom(service.getCleaningPerformance(1));
    expect(result).toHaveProperty('score');
  });
});
