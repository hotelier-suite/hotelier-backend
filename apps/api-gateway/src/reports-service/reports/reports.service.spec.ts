import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { ReportsService } from './';
import { REPORTS_SERVICE_CLIENT } from '../constants';

describe('ReportsService (gateway)', () => {
  let service: ReportsService;
  const mockClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: REPORTS_SERVICE_CLIENT, useValue: mockClient },
      ],
    }).compile();
    service = module.get<ReportsService>(ReportsService);
    jest.clearAllMocks();
  });

  it('should findAll', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should create', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should generateOccupancyReport', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      service.generateOccupancyReport(new Date(), new Date(), 'admin'),
    );
    expect(result).toHaveProperty('id');
  });

  it('should generateRevenueReport', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      service.generateRevenueReport(new Date(), new Date(), 'admin'),
    );
    expect(result).toHaveProperty('id');
  });

  it('should generateGuestSatisfactionReport', async () => {
    mockClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      service.generateGuestSatisfactionReport(new Date(), new Date(), 'admin'),
    );
    expect(result).toHaveProperty('id');
  });

  it('should getFinancialSummary', async () => {
    mockClient.send.mockReturnValueOnce(of({ revenue: 5000 }));
    const result = await lastValueFrom(
      service.getFinancialSummary(new Date(), new Date()),
    );
    expect(result).toHaveProperty('revenue');
  });

  it('should getOccupancyByMonthYear', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getOccupancyByMonthYear(2024));
    expect(result).toEqual([]);
  });

  it('should getMonthlyRevenueComparison', async () => {
    mockClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(
      service.getMonthlyRevenueComparison(2024),
    );
    expect(result).toEqual([]);
  });

  it('should generateFinancialReportPdf', async () => {
    mockClient.send.mockReturnValueOnce(
      of({ buffer: '', filename: 'report.pdf' }),
    );
    const result = await lastValueFrom(
      service.generateFinancialReportPdf(2024),
    );
    expect(result).toHaveProperty('filename');
  });
});
