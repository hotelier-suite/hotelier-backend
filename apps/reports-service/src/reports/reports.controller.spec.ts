import { Test, TestingModule } from '@nestjs/testing';
import { ReportsController, ReportsService } from './';
import {
  ReportDto,
  CreateReportDto,
  UpdateReportDto,
  ReportType,
  FinancialSummaryDto,
  ReportOccupancyDataDto,
  MonthlyRevenueDto,
  FinancialReportPdfDto,
  FindReportsFilterDto,
} from '@app/contracts/reports-service';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockReport: ReportDto = {
    id: 1,
    title: 'Occupancy Report',
    type: ReportType.OCCUPANCY,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    generatedBy: 'admin@hotel.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
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
    service = module.get<ReportsService>(ReportsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all reports', async () => {
      const filters: FindReportsFilterDto = {};
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockReport]);
      const result = await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
      expect(result).toEqual([mockReport]);
    });
  });

  describe('findOne', () => {
    it('should return a report by id', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.findOne(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockReport);
    });
  });

  describe('create', () => {
    it('should create a report', async () => {
      const dto: CreateReportDto = {
        title: 'Test Report',
        type: ReportType.OCCUPANCY,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        generatedBy: 'admin@hotel.com',
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.create(dto);
      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockReport);
    });
  });

  describe('update', () => {
    it('should update a report', async () => {
      const data: UpdateReportDto = { title: 'Updated Report' };
      const updated = { ...mockReport, title: 'Updated Report' };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data });
      expect(spy).toHaveBeenCalledWith(1, data);
      expect(result.title).toBe('Updated Report');
    });
  });

  describe('remove', () => {
    it('should remove a report', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.remove(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockReport);
    });
  });

  describe('generateOccupancyReport', () => {
    it('should generate an occupancy report', async () => {
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        generatedBy: 'admin@hotel.com',
      };
      const spy = jest
        .spyOn(service, 'generateOccupancyReport')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.generateOccupancyReport(payload);
      expect(spy).toHaveBeenCalledWith(
        payload.startDate,
        payload.endDate,
        payload.generatedBy,
      );
      expect(result).toEqual(mockReport);
    });
  });

  describe('generateRevenueReport', () => {
    it('should generate a revenue report', async () => {
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        generatedBy: 'admin@hotel.com',
      };
      const spy = jest
        .spyOn(service, 'generateRevenueReport')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.generateRevenueReport(payload);
      expect(spy).toHaveBeenCalledWith(
        payload.startDate,
        payload.endDate,
        payload.generatedBy,
      );
      expect(result).toEqual(mockReport);
    });
  });

  describe('generateGuestSatisfactionReport', () => {
    it('should generate a guest satisfaction report', async () => {
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        generatedBy: 'admin@hotel.com',
      };
      const spy = jest
        .spyOn(service, 'generateGuestSatisfactionReport')
        .mockResolvedValueOnce(mockReport);
      const result = await controller.generateGuestSatisfactionReport(payload);
      expect(spy).toHaveBeenCalledWith(
        payload.startDate,
        payload.endDate,
        payload.generatedBy,
      );
      expect(result).toEqual(mockReport);
    });
  });

  describe('getFinancialSummary', () => {
    it('should return financial summary', async () => {
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      const summary: FinancialSummaryDto = {
        revenue: {
          room: 5000,
          restaurant: 2000,
          services: 1000,
          events: 500,
          total: 8500,
        },
        expenses: 3000,
        grossProfit: 5500,
        profitMargin: 64.71,
      };
      const spy = jest
        .spyOn(service, 'getFinancialSummary')
        .mockResolvedValueOnce(summary);
      const result = await controller.getFinancialSummary(payload);
      expect(spy).toHaveBeenCalledWith(payload.startDate, payload.endDate);
      expect(result).toEqual(summary);
    });
  });

  describe('getOccupancyByMonthYear', () => {
    it('should return occupancy by month and year', async () => {
      const payload = { year: 2024, month: 1 };
      const data: ReportOccupancyDataDto[] = [
        {
          date: new Date('2024-01-01'),
          occupancyPercentage: 85,
          totalRevenue: 5000,
        },
      ];
      const spy = jest
        .spyOn(service, 'getOccupancyByMonthYear')
        .mockResolvedValueOnce(data);
      const result = await controller.getOccupancyByMonthYear(payload);
      expect(spy).toHaveBeenCalledWith(payload.year, payload.month);
      expect(result).toEqual(data);
    });
  });

  describe('getMonthlyRevenueComparison', () => {
    it('should return monthly revenue comparison', async () => {
      const payload = { year: 2024 };
      const data: MonthlyRevenueDto[] = [
        { month: 'Jan', revenue: 10000, expenses: 3000, profit: 7000 },
      ];
      const spy = jest
        .spyOn(service, 'getMonthlyRevenueComparison')
        .mockResolvedValueOnce(data);
      const result = await controller.getMonthlyRevenueComparison(payload);
      expect(spy).toHaveBeenCalledWith(payload.year);
      expect(result).toEqual(data);
    });
  });

  describe('generateFinancialReportPdf', () => {
    it('should generate a financial report PDF', async () => {
      const payload = { year: 2024, month: 6 };
      const pdfResult: FinancialReportPdfDto = {
        buffer: Buffer.from('test-pdf'),
        filename: 'financial-report-2024-6.pdf',
      };
      const spy = jest
        .spyOn(service, 'generateFinancialReportPdf')
        .mockResolvedValueOnce(pdfResult);
      const result = await controller.generateFinancialReportPdf(payload);
      expect(spy).toHaveBeenCalledWith(payload.year, payload.month);
      expect(result).toEqual(pdfResult);
    });
  });
});
