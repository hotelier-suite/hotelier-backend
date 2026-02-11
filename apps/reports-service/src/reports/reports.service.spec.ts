jest.mock('pdfkit', () => {
  return jest.fn().mockImplementation(() => {
    type EventHandler = (...args: unknown[]) => void;
    const handlers = new Map<string, EventHandler>();
    const doc: Record<string, unknown> = {};
    doc.on = jest.fn((event: string, handler: EventHandler) => {
      handlers.set(event, handler);
      return doc;
    });
    doc.fontSize = jest.fn(() => doc);
    doc.font = jest.fn(() => doc);
    doc.text = jest.fn(() => doc);
    doc.moveDown = jest.fn(() => doc);
    doc.moveTo = jest.fn(() => doc);
    doc.lineTo = jest.fn(() => doc);
    doc.stroke = jest.fn(() => doc);
    doc.addPage = jest.fn(() => doc);
    doc.end = jest.fn(() => {
      const dataHandler = handlers.get('data');
      if (dataHandler) dataHandler(Buffer.from('test-pdf'));
      const endHandler = handlers.get('end');
      if (endHandler) endHandler();
    });
    doc.y = 100;
    return doc;
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { ReportsService } from './';
import { Report } from './entities';
import {
  ReportType,
  ReportDto,
  CreateReportDto,
  UpdateReportDto,
  ReportStatus,
  FindReportsFilterDto,
} from '@app/contracts/reports-service';
import { BILLING_STATISTICS_PATTERNS } from '@app/contracts/billing-service';
import {
  ROOMS_PATTERNS,
  ReservationStatus,
} from '@app/contracts/booking-service';

describe('ReportsService', () => {
  let service: ReportsService;

  const mockRepository: Record<string, jest.Mock> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockBillingClient: Record<string, jest.Mock> = {
    send: jest.fn(),
  };

  const mockBookingClient: Record<string, jest.Mock> = {
    send: jest.fn(),
  };

  const mockReport: ReportDto = {
    id: 1,
    title: 'Occupancy Report',
    type: ReportType.OCCUPANCY,
    status: ReportStatus.COMPLETED,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    generatedBy: 'admin@hotel.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: getRepositoryToken(Report), useValue: mockRepository },
        { provide: 'BILLING_SERVICE', useValue: mockBillingClient },
        { provide: 'BOOKING_SERVICE', useValue: mockBookingClient },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.save.mockResolvedValueOnce(mockReport);
      const result = await service.create(dto);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockReport);
    });
  });

  describe('findAll', () => {
    it('should return all reports with no filters', async () => {
      mockRepository.find.mockResolvedValueOnce([mockReport]);
      const result = await service.findAll();
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: {}, order: { createdAt: 'DESC' } }),
      );
      expect(result).toEqual([mockReport]);
    });

    it('should filter by type', async () => {
      const filters: FindReportsFilterDto = { type: ReportType.OCCUPANCY };
      mockRepository.find.mockResolvedValueOnce([mockReport]);
      await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { type: ReportType.OCCUPANCY } }),
      );
    });

    it('should filter by status', async () => {
      const filters: FindReportsFilterDto = { status: ReportStatus.COMPLETED };
      mockRepository.find.mockResolvedValueOnce([mockReport]);
      await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { status: ReportStatus.COMPLETED } }),
      );
    });

    it('should filter by date range', async () => {
      const filters: FindReportsFilterDto = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      mockRepository.find.mockResolvedValueOnce([]);
      await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should filter by startDate only', async () => {
      const filters: FindReportsFilterDto = {
        startDate: new Date('2024-01-01'),
      };
      mockRepository.find.mockResolvedValueOnce([]);
      await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalled();
    });

    it('should filter by endDate only', async () => {
      const filters: FindReportsFilterDto = { endDate: new Date('2024-01-31') };
      mockRepository.find.mockResolvedValueOnce([]);
      await service.findAll(filters);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a report by id', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockReport);
      const result = await service.findOne(1);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockReport);
    });

    it('should throw RpcException when not found', async () => {
      mockRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a report', async () => {
      const data: UpdateReportDto = { title: 'Updated Report' };
      const updated = { ...mockReport, title: 'Updated Report' };
      mockRepository.findOne.mockResolvedValueOnce(mockReport);
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.merge.mockReturnValueOnce(updated);
      mockRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, data);
      expect(result.title).toBe('Updated Report');
    });
  });

  describe('remove', () => {
    it('should remove a report', async () => {
      mockRepository.findOne.mockResolvedValueOnce(mockReport);
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.remove.mockResolvedValueOnce(mockReport);
      const result = await service.remove(1);
      expect(result).toEqual(mockReport);
    });
  });

  describe('generateOccupancyReport', () => {
    it('should generate an occupancy report', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.save.mockResolvedValueOnce(mockReport);
      const result = await service.generateOccupancyReport(
        startDate,
        endDate,
        'admin@hotel.com',
      );
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: ReportType.OCCUPANCY }),
      );
      expect(result).toEqual(mockReport);
    });
  });

  describe('generateRevenueReport', () => {
    it('should generate a revenue report', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.save.mockResolvedValueOnce(mockReport);
      const result = await service.generateRevenueReport(
        startDate,
        endDate,
        'admin@hotel.com',
      );
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: ReportType.REVENUE }),
      );
      expect(result).toEqual(mockReport);
    });
  });

  describe('generateGuestSatisfactionReport', () => {
    it('should generate a guest satisfaction report', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-01-31');
      mockRepository.create.mockReturnValueOnce(mockReport);
      mockRepository.save.mockResolvedValueOnce(mockReport);
      const result = await service.generateGuestSatisfactionReport(
        startDate,
        endDate,
        'admin@hotel.com',
      );
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({ type: ReportType.GUEST_SATISFACTION }),
      );
      expect(result).toEqual(mockReport);
    });
  });

  describe('getFinancialSummary', () => {
    const mockFinancialSummaryResponse = {
      totalRevenue: 15000,
      paidAmount: 12000,
      pendingAmount: 3000,
      overdueAmount: 500,
      totalPaidInvoices: 25,
      totalPendingInvoices: 8,
      totalOverdueInvoices: 2,
    };

    const mockInvoices = [
      {
        id: 1,
        invoiceItems: [
          { description: 'Room 101 - Deluxe Suite', total: 200 },
          { description: 'Restaurant Dinner', total: 50 },
          { description: 'Wedding Venue Booking', total: 100 },
          { description: 'Spa Service', total: 75 },
        ],
        taxes: 30,
        total: 455,
        createdAt: new Date(2024, 5, 15),
      },
    ];

    it('should return financial summary with categorized revenue', async () => {
      mockBillingClient.send
        .mockReturnValueOnce(of(mockFinancialSummaryResponse))
        .mockReturnValueOnce(of(mockInvoices));

      const result = await service.getFinancialSummary(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(mockBillingClient.send).toHaveBeenCalledTimes(2);
      expect(result.revenue.room).toBe(200);
      expect(result.revenue.restaurant).toBe(50);
      expect(result.revenue.events).toBe(100); // 'wedding' is events keyword
      expect(result.revenue.services).toBe(75);
      expect(result.expenses).toBe(3000);
      expect(result.revenue.total).toBe(425);
      expect(result.grossProfit).toBe(425 - 3000);
    });

    it('should return 0 profit margin when total revenue is 0', async () => {
      mockBillingClient.send
        .mockReturnValueOnce(
          of({ ...mockFinancialSummaryResponse, pendingAmount: 0 }),
        )
        .mockReturnValueOnce(of([]));

      const result = await service.getFinancialSummary(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result.revenue.total).toBe(0);
      expect(result.profitMargin).toBe(0);
    });

    it('should handle invoices with no items', async () => {
      const invoiceNoItems = [
        {
          id: 1,
          invoiceItems: null,
          taxes: 0,
          total: 100,
          createdAt: new Date(),
        },
      ];
      mockBillingClient.send
        .mockReturnValueOnce(of(mockFinancialSummaryResponse))
        .mockReturnValueOnce(of(invoiceNoItems));

      const result = await service.getFinancialSummary(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );

      expect(result.revenue.total).toBe(0);
    });

    it('should throw RpcException on billing service timeout', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'TimeoutError';
      mockBillingClient.send
        .mockReturnValueOnce(throwError(() => timeoutError))
        .mockReturnValueOnce(of([]));

      await expect(
        service.getFinancialSummary(
          new Date('2024-01-01'),
          new Date('2024-12-31'),
        ),
      ).rejects.toThrow(RpcException);
    });

    it('should throw RpcException on billing service unavailable', async () => {
      mockBillingClient.send
        .mockReturnValueOnce(throwError(() => new Error('Connection refused')))
        .mockReturnValueOnce(of([]));

      await expect(
        service.getFinancialSummary(
          new Date('2024-01-01'),
          new Date('2024-12-31'),
        ),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('getOccupancyByMonthYear', () => {
    const mockRooms = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const mockReservations = [
      {
        id: 1,
        checkInDate: new Date(2024, 0, 10),
        checkOutDate: new Date(2024, 0, 15),
        status: ReservationStatus.CONFIRMED,
        roomId: 1,
        nights: 5,
        totalAmount: 500,
      },
      {
        id: 2,
        checkInDate: new Date(2024, 0, 12),
        checkOutDate: new Date(2024, 0, 14),
        status: ReservationStatus.CHECKED_OUT,
        roomId: 2,
        nights: 2,
        totalAmount: 200,
      },
      {
        id: 3,
        checkInDate: new Date(2024, 0, 20),
        checkOutDate: new Date(2024, 0, 22),
        status: ReservationStatus.CANCELLED,
        roomId: 3,
        nights: 2,
        totalAmount: 200,
      },
    ];

    it('should return empty data when no rooms available', async () => {
      mockBookingClient.send
        .mockReturnValueOnce(of([]))
        .mockReturnValueOnce(of([]));

      const result = await service.getOccupancyByMonthYear(2024, 1);
      expect(result).toHaveLength(31);
      expect(result[0].occupancyPercentage).toBe(0);
    });

    it('should return empty monthly data when no rooms and no month', async () => {
      mockBookingClient.send
        .mockReturnValueOnce(of([]))
        .mockReturnValueOnce(of([]));

      const result = await service.getOccupancyByMonthYear(2024);
      expect(result).toHaveLength(12);
      expect(result[0].occupancyPercentage).toBe(0);
    });

    it('should calculate daily occupancy when month is provided', async () => {
      mockBookingClient.send
        .mockReturnValueOnce(of(mockRooms))
        .mockReturnValueOnce(of(mockReservations));

      const result = await service.getOccupancyByMonthYear(2024, 1);
      expect(result).toHaveLength(31);
      const occupiedDay = result[11];
      expect(occupiedDay.occupancyPercentage).toBeGreaterThan(0);
    });

    it('should calculate monthly occupancy when no month provided', async () => {
      mockBookingClient.send
        .mockReturnValueOnce(of(mockRooms))
        .mockReturnValueOnce(of(mockReservations));

      const result = await service.getOccupancyByMonthYear(2024);
      expect(result).toHaveLength(12);
      expect(result[0].occupancyPercentage).toBeGreaterThan(0);
    });

    it('should filter out cancelled reservations', async () => {
      const onlyCancelled = [
        {
          id: 1,
          checkInDate: new Date(2024, 0, 10),
          checkOutDate: new Date(2024, 0, 15),
          status: ReservationStatus.CANCELLED,
          roomId: 1,
          nights: 5,
          totalAmount: 500,
        },
      ];
      mockBookingClient.send
        .mockReturnValueOnce(of(mockRooms))
        .mockReturnValueOnce(of(onlyCancelled));

      const result = await service.getOccupancyByMonthYear(2024, 1);
      const allZero = result.every((d) => d.occupancyPercentage === 0);
      expect(allZero).toBe(true);
    });

    it('should throw RpcException on booking service timeout', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'TimeoutError';
      mockBookingClient.send
        .mockReturnValueOnce(throwError(() => timeoutError))
        .mockReturnValueOnce(of([]));

      await expect(service.getOccupancyByMonthYear(2024, 1)).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw RpcException on booking service unavailable', async () => {
      mockBookingClient.send
        .mockReturnValueOnce(throwError(() => new Error('Connection refused')))
        .mockReturnValueOnce(of([]));

      await expect(service.getOccupancyByMonthYear(2024, 1)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('getMonthlyRevenueComparison', () => {
    it('should return monthly revenue data', async () => {
      const invoices = [
        {
          id: 1,
          invoiceItems: [
            { description: 'Room 101', total: 200 },
            { description: 'Breakfast', total: 30 },
          ],
          taxes: 20,
          total: 250,
          createdAt: new Date(2024, 0, 15),
        },
        {
          id: 2,
          invoiceItems: [{ description: 'Room 202', total: 300 }],
          taxes: 25,
          total: 325,
          createdAt: new Date(2024, 2, 10),
        },
      ];

      mockBillingClient.send.mockReturnValueOnce(of(invoices));
      const result = await service.getMonthlyRevenueComparison(2024);

      expect(result).toHaveLength(12);
      expect(result[0].month).toBe('Jan');
      expect(result[0].revenue).toBe(230);
      expect(result[0].expenses).toBe(20);
      expect(result[2].month).toBe('Mar');
      expect(result[2].revenue).toBe(300);
    });

    it('should calculate revenue from total when no items', async () => {
      const invoices = [
        {
          id: 1,
          invoiceItems: [],
          taxes: 10,
          total: 500,
          createdAt: new Date(2024, 5, 1),
        },
      ];

      mockBillingClient.send.mockReturnValueOnce(of(invoices));
      const result = await service.getMonthlyRevenueComparison(2024);

      expect(result[5].month).toBe('Jun');
      expect(result[5].revenue).toBe(500);
    });

    it('should skip invoices from wrong year', async () => {
      const invoices = [
        {
          id: 1,
          invoiceItems: [{ description: 'Room', total: 100 }],
          taxes: 0,
          total: 100,
          createdAt: new Date(2023, 5, 1),
        },
      ];

      mockBillingClient.send.mockReturnValueOnce(of(invoices));
      const result = await service.getMonthlyRevenueComparison(2024);

      const totalRevenue = result.reduce((sum, m) => sum + m.revenue, 0);
      expect(totalRevenue).toBe(0);
    });

    it('should throw RpcException on timeout', async () => {
      const timeoutError = new Error('Timeout');
      timeoutError.name = 'TimeoutError';
      mockBillingClient.send.mockReturnValueOnce(
        throwError(() => timeoutError),
      );

      await expect(service.getMonthlyRevenueComparison(2024)).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw RpcException on service unavailable', async () => {
      mockBillingClient.send.mockReturnValueOnce(
        throwError(() => new Error('Connection refused')),
      );

      await expect(service.getMonthlyRevenueComparison(2024)).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('generateFinancialReportPdf', () => {
    const setupPdfMocks = () => {
      const financialSummaryResponse = {
        totalRevenue: 10000,
        paidAmount: 8000,
        pendingAmount: 2000,
        overdueAmount: 0,
        totalPaidInvoices: 20,
        totalPendingInvoices: 5,
        totalOverdueInvoices: 0,
      };
      const invoices = [
        {
          id: 1,
          invoiceItems: [{ description: 'Room stay', total: 500 }],
          taxes: 50,
          total: 550,
          createdAt: new Date(2024, 5, 15),
        },
      ];
      const rooms = [{ id: 1 }, { id: 2 }];
      const reservations = [
        {
          id: 1,
          checkInDate: new Date(2024, 5, 10),
          checkOutDate: new Date(2024, 5, 15),
          status: ReservationStatus.CONFIRMED,
          roomId: 1,
          nights: 5,
          totalAmount: 500,
        },
      ];

      mockBillingClient.send.mockImplementation((pattern: string) => {
        if (pattern === BILLING_STATISTICS_PATTERNS.FINANCIAL_SUMMARY) {
          return of(financialSummaryResponse);
        }
        return of(invoices);
      });

      mockBookingClient.send.mockImplementation((pattern: string) => {
        if (pattern === ROOMS_PATTERNS.FIND_ALL) {
          return of(rooms);
        }
        return of(reservations);
      });
    };

    it('should generate a full year financial report PDF', async () => {
      setupPdfMocks();
      const result = await service.generateFinancialReportPdf(2024);
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.filename).toBe('financial-report-2024.pdf');
    });

    it('should generate a monthly financial report PDF', async () => {
      setupPdfMocks();
      const result = await service.generateFinancialReportPdf(2024, 6);
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.filename).toBe('financial-report-2024-6.pdf');
    });
  });
});
