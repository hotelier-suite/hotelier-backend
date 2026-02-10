import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

describe('StatisticsController', () => {
  let controller: StatisticsController;
  let service: StatisticsService;

  const mockFinancialSummary = {
    totalRevenue: 1000,
    paidAmount: 800,
    pendingAmount: 200,
    overdueAmount: 50,
    totalPaidInvoices: 5,
    totalPendingInvoices: 2,
    totalOverdueInvoices: 1,
  };

  const mockPaymentStats = {
    totalPayments: 10,
    totalAmount: 5000,
    averagePayment: 500,
    completedPayments: 8,
    pendingPayments: 2,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        {
          provide: StatisticsService,
          useValue: {
            getYearToDateFinancialSummary: jest.fn(),
            getFinancialSummary: jest.fn(),
            getPaymentStatistics: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(StatisticsController);
    service = module.get(StatisticsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getYearToDateFinancialSummary', () => {
    it('should delegate to service', async () => {
      const spy = jest
        .spyOn(service, 'getYearToDateFinancialSummary')
        .mockResolvedValueOnce(mockFinancialSummary);

      const result = await controller.getYearToDateFinancialSummary();
      expect(result).toEqual(mockFinancialSummary);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('getFinancialSummary', () => {
    it('should delegate with date range', async () => {
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
      };
      const spy = jest
        .spyOn(service, 'getFinancialSummary')
        .mockResolvedValueOnce(mockFinancialSummary);

      const result = await controller.getFinancialSummary(payload);
      expect(result).toEqual(mockFinancialSummary);
      expect(spy).toHaveBeenCalledWith(payload.startDate, payload.endDate);
    });
  });

  describe('getPaymentStatistics', () => {
    it('should delegate to service', async () => {
      const spy = jest
        .spyOn(service, 'getPaymentStatistics')
        .mockResolvedValueOnce(mockPaymentStats);

      const result = await controller.getPaymentStatistics();
      expect(result).toEqual(mockPaymentStats);
      expect(spy).toHaveBeenCalled();
    });
  });
});
