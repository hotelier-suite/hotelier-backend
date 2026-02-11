import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { StreamableFile } from '@nestjs/common';
import { ReportsController } from './';
import { ReportsService } from './reports.service';

describe('ReportsController (gateway)', () => {
  let controller: ReportsController;
  const mockService: Record<string, jest.Mock> = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    generateOccupancyReport: jest.fn(),
    generateRevenueReport: jest.fn(),
    generateGuestSatisfactionReport: jest.fn(),
    getFinancialSummary: jest.fn(),
    getOccupancyByMonthYear: jest.fn(),
    getMonthlyRevenueComparison: jest.fn(),
    generateFinancialReportPdf: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [{ provide: ReportsService, useValue: mockService }],
    }).compile();
    controller = module.get<ReportsController>(ReportsController);
    jest.clearAllMocks();
  });

  it('should findAll', async () => {
    mockService.findAll.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(controller.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should getFinancialSummary', async () => {
    mockService.getFinancialSummary.mockReturnValueOnce(of({ revenue: 5000 }));
    const result = await lastValueFrom(
      controller.getFinancialSummary(new Date(), new Date()),
    );
    expect(result).toHaveProperty('revenue');
  });

  it('should getOccupancyByMonthYear', async () => {
    mockService.getOccupancyByMonthYear.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(
      controller.getOccupancyByMonthYear(2024),
    );
    expect(result).toEqual([]);
  });

  it('should getMonthlyRevenueComparison', async () => {
    mockService.getMonthlyRevenueComparison.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(
      controller.getMonthlyRevenueComparison(2024),
    );
    expect(result).toEqual([]);
  });

  it('should downloadFinancialReport', async () => {
    mockService.generateFinancialReportPdf.mockReturnValueOnce(
      of({
        buffer: Buffer.from('pdf').toString('base64'),
        filename: 'report.pdf',
      }),
    );
    const result = await lastValueFrom(
      controller.downloadFinancialReport(2024),
    );
    expect(result).toBeInstanceOf(StreamableFile);
  });

  it('should findOne', async () => {
    mockService.findOne.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should create', async () => {
    mockService.create.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(controller.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should generateOccupancyReport', async () => {
    mockService.generateOccupancyReport.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.generateOccupancyReport(new Date(), new Date(), 'admin'),
    );
    expect(result).toHaveProperty('id');
  });

  it('should generateRevenueReport', async () => {
    mockService.generateRevenueReport.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(
      controller.generateRevenueReport(new Date(), new Date(), 'admin'),
    );
    expect(result).toHaveProperty('id');
  });

  it('should generateGuestSatisfactionReport', async () => {
    mockService.generateGuestSatisfactionReport.mockReturnValueOnce(
      of({ id: 1 }),
    );
    const result = await lastValueFrom(
      controller.generateGuestSatisfactionReport(
        new Date(),
        new Date(),
        'admin',
      ),
    );
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
});
