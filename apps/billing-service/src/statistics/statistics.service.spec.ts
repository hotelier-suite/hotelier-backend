import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StatisticsService } from './statistics.service';
import { Invoice } from '../invoices/entities';
import { Payment } from '../payments/entities';
import { PaymentStatus } from '@app/contracts/billing-service';

function createMockQueryBuilder() {
  const qb: Record<string, jest.Mock> = {};
  qb.select = jest.fn().mockReturnValue(qb);
  qb.addSelect = jest.fn().mockReturnValue(qb);
  qb.where = jest.fn().mockReturnValue(qb);
  qb.andWhere = jest.fn().mockReturnValue(qb);
  qb.getRawOne = jest.fn().mockResolvedValue({ total: '0', count: '0' });
  return qb;
}

describe('StatisticsService', () => {
  let service: StatisticsService;
  let invoiceRepo: Record<string, jest.Mock>;
  let paymentRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    invoiceRepo = {
      createQueryBuilder: jest.fn(),
    };

    paymentRepo = {
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: getRepositoryToken(Invoice), useValue: invoiceRepo },
        { provide: getRepositoryToken(Payment), useValue: paymentRepo },
      ],
    }).compile();

    service = module.get(StatisticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getPaymentStatistics', () => {
    it('should calculate statistics from payments', async () => {
      paymentRepo.find.mockResolvedValueOnce([
        { amount: 100, status: PaymentStatus.COMPLETED },
        { amount: 200, status: PaymentStatus.COMPLETED },
        { amount: 50, status: PaymentStatus.PENDING },
      ]);

      const result = await service.getPaymentStatistics();
      expect(result.totalPayments).toBe(3);
      expect(result.totalAmount).toBe(350);
      expect(result.averagePayment).toBeCloseTo(116.67, 1);
      expect(result.completedPayments).toBe(2);
      expect(result.pendingPayments).toBe(1);
    });

    it('should handle no payments', async () => {
      paymentRepo.find.mockResolvedValueOnce([]);

      const result = await service.getPaymentStatistics();
      expect(result.totalPayments).toBe(0);
      expect(result.totalAmount).toBe(0);
      expect(result.averagePayment).toBe(0);
    });
  });

  describe('getFinancialSummary', () => {
    it('should return financial summary for date range', async () => {
      const totalQb = createMockQueryBuilder();
      totalQb.getRawOne.mockResolvedValueOnce({ total: '5000' });
      const paidQb = createMockQueryBuilder();
      paidQb.getRawOne.mockResolvedValueOnce({ count: '3', total: '3000' });
      const pendingQb = createMockQueryBuilder();
      pendingQb.getRawOne.mockResolvedValueOnce({
        count: '2',
        total: '2000',
      });
      const overdueQb = createMockQueryBuilder();
      overdueQb.getRawOne.mockResolvedValueOnce({ count: '1', total: '500' });

      invoiceRepo.createQueryBuilder
        .mockReturnValueOnce(totalQb)
        .mockReturnValueOnce(paidQb)
        .mockReturnValueOnce(pendingQb)
        .mockReturnValueOnce(overdueQb);

      const result = await service.getFinancialSummary(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result.totalRevenue).toBe(5000);
      expect(result.paidAmount).toBe(3000);
      expect(result.pendingAmount).toBe(2000);
      expect(result.overdueAmount).toBe(500);
      expect(result.totalPaidInvoices).toBe(3);
      expect(result.totalPendingInvoices).toBe(2);
      expect(result.totalOverdueInvoices).toBe(1);
    });

    it('should handle null results', async () => {
      const qb = createMockQueryBuilder();
      qb.getRawOne.mockResolvedValue(null);
      invoiceRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getFinancialSummary(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result.totalRevenue).toBe(0);
      expect(result.paidAmount).toBe(0);
      expect(result.pendingAmount).toBe(0);
      expect(result.overdueAmount).toBe(0);
    });
  });

  describe('getYearToDateFinancialSummary', () => {
    it('should call getFinancialSummary with year-to-date range', async () => {
      const qb = createMockQueryBuilder();
      invoiceRepo.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getYearToDateFinancialSummary();
      expect(result).toBeDefined();
      expect(result.totalRevenue).toBe(0);
    });
  });
});
