import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { lastValueFrom, of, timeout, catchError } from 'rxjs';
import { Report } from './entities';
import {
  CreateReportDto,
  UpdateReportDto,
  ReportType,
  ReportStatus,
  ReportDto,
  FinancialSummaryDto,
  ReportOccupancyDataDto,
  MonthlyRevenueDto,
  FinancialReportPdfDto,
  FindReportsFilterDto,
} from '@app/contracts/reports-service';
import {
  BILLING_STATISTICS_PATTERNS,
  INVOICES_PATTERNS,
  FinancialSummaryResponseDto,
  InvoiceDto,
} from '@app/contracts/billing-service';
import {
  RESERVATIONS_PATTERNS,
  ROOMS_PATTERNS,
  ReservationDto,
  RoomDto,
  ReservationStatus,
} from '@app/contracts/booking-service';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @Inject('BILLING_SERVICE')
    private readonly billingClient: ClientProxy,
    @Inject('BOOKING_SERVICE')
    private readonly bookingClient: ClientProxy,
  ) {}

  async create(data: CreateReportDto): Promise<ReportDto> {
    const report = this.reportRepository.create({
      ...data,
      status: data.status || ReportStatus.PENDING,
    });
    return this.reportRepository.save(report);
  }

  async findAll(filters?: FindReportsFilterDto): Promise<ReportDto[]> {
    const where: FindOptionsWhere<Report> = {};

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate && filters?.endDate) {
      where.createdAt = Between(filters.startDate, filters.endDate);
    }

    return this.reportRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<ReportDto> {
    const report = await this.reportRepository.findOne({
      where: { id },
    });
    if (!report) {
      throw new RpcException({
        statusCode: 404,
        message: `Report with id ${id} not found`,
      });
    }
    return report;
  }

  async updateStatus(id: number, status: ReportStatus): Promise<ReportDto> {
    await this.reportRepository.update(id, { status });
    return this.findOne(id);
  }

  async update(id: number, data: UpdateReportDto): Promise<ReportDto> {
    await this.reportRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<ReportDto> {
    const report = await this.findOne(id);
    await this.reportRepository.remove(report as Report);
    return report;
  }

  async generateOccupancyReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<ReportDto> {
    return this.create({
      title: `Occupancy Report ${startDate.toDateString()} - ${endDate.toDateString()}`,
      type: ReportType.OCCUPANCY,
      startDate,
      endDate,
      parameters: {
        reportType: 'occupancy',
        dateRange: { startDate, endDate },
      },
      generatedBy,
    });
  }

  async generateRevenueReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<ReportDto> {
    return this.create({
      title: `Revenue Report ${startDate.toDateString()} - ${endDate.toDateString()}`,
      type: ReportType.REVENUE,
      startDate,
      endDate,
      parameters: {
        reportType: 'revenue',
        dateRange: { startDate, endDate },
      },
      generatedBy,
    });
  }

  async generateGuestSatisfactionReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<ReportDto> {
    return this.create({
      title: `Guest Satisfaction Report ${startDate.toDateString()} - ${endDate.toDateString()}`,
      type: ReportType.GUEST_SATISFACTION,
      startDate,
      endDate,
      parameters: {
        reportType: 'guest_satisfaction',
        dateRange: { startDate, endDate },
      },
      generatedBy,
    });
  }

  private static readonly SERVICE_TIMEOUT = 5000;

  async getFinancialSummary(
    startDate: Date,
    endDate: Date,
  ): Promise<FinancialSummaryDto> {
    const [financialSummary, invoices] = await Promise.all([
      lastValueFrom(
        this.billingClient
          .send<
            FinancialSummaryResponseDto,
            { startDate: Date; endDate: Date }
          >(BILLING_STATISTICS_PATTERNS.FINANCIAL_SUMMARY, {
            startDate,
            endDate,
          })
          .pipe(
            timeout(ReportsService.SERVICE_TIMEOUT),
            catchError((error: Error) => {
              if (error.name === 'TimeoutError') {
                throw new RpcException({
                  statusCode: 503,
                  message: 'Billing service request timed out',
                });
              }
              throw new RpcException({
                statusCode: 503,
                message: 'Billing service is unavailable',
              });
            }),
          ),
      ),
      lastValueFrom(
        this.billingClient
          .send<InvoiceDto[], { startDate: Date; endDate: Date }>(
            INVOICES_PATTERNS.FIND_BY_DATE_RANGE,
            {
              startDate,
              endDate,
            },
          )
          .pipe(
            timeout(ReportsService.SERVICE_TIMEOUT),
            catchError(() => of([] as InvoiceDto[])),
          ),
      ),
    ]);

    const revenueByCategory = this.categorizeRevenue(invoices);

    const totalRevenue =
      revenueByCategory.room +
      revenueByCategory.restaurant +
      revenueByCategory.services +
      revenueByCategory.events;

    const expenses = financialSummary.pendingAmount || 0;

    const grossProfit = totalRevenue - expenses;
    const profitMargin =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      revenue: {
        room: revenueByCategory.room,
        restaurant: revenueByCategory.restaurant,
        services: revenueByCategory.services,
        events: revenueByCategory.events,
        total: totalRevenue,
      },
      expenses,
      grossProfit,
      profitMargin: Math.round(profitMargin * 100) / 100,
    };
  }

  private categorizeRevenue(invoices: InvoiceDto[]): {
    room: number;
    restaurant: number;
    services: number;
    events: number;
  } {
    const categories = {
      room: 0,
      restaurant: 0,
      services: 0,
      events: 0,
    };

    for (const invoice of invoices) {
      for (const item of invoice.invoiceItems || []) {
        const description = item.description.toLowerCase();
        const amount = Number(item.total) || 0;

        if (this.isRoomCategory(description)) {
          categories.room += amount;
        } else if (this.isRestaurantCategory(description)) {
          categories.restaurant += amount;
        } else if (this.isEventsCategory(description)) {
          categories.events += amount;
        } else {
          categories.services += amount;
        }
      }
    }

    return categories;
  }

  private isRoomCategory(description: string): boolean {
    const roomKeywords = [
      'room',
      'accommodation',
      'lodging',
      'stay',
      'night',
      'suite',
      'bed',
    ];
    return roomKeywords.some((keyword) => description.includes(keyword));
  }

  private isRestaurantCategory(description: string): boolean {
    const restaurantKeywords = [
      'restaurant',
      'food',
      'meal',
      'breakfast',
      'lunch',
      'dinner',
      'beverage',
      'drink',
      'bar',
      'dining',
      'catering',
    ];
    return restaurantKeywords.some((keyword) => description.includes(keyword));
  }

  private isEventsCategory(description: string): boolean {
    const eventsKeywords = [
      'event',
      'venue',
      'conference',
      'meeting',
      'banquet',
      'wedding',
      'party',
      'celebration',
    ];
    return eventsKeywords.some((keyword) => description.includes(keyword));
  }

  async getOccupancyByMonthYear(
    year: number,
    month?: number,
  ): Promise<ReportOccupancyDataDto[]> {
    const [rooms, reservations] = await Promise.all([
      lastValueFrom(
        this.bookingClient
          .send<RoomDto[], Record<string, never>>(ROOMS_PATTERNS.FIND_ALL, {})
          .pipe(
            timeout(ReportsService.SERVICE_TIMEOUT),
            catchError((error: Error) => {
              if (error.name === 'TimeoutError') {
                throw new RpcException({
                  statusCode: 503,
                  message: 'Booking service request timed out',
                });
              }
              throw new RpcException({
                statusCode: 503,
                message: 'Booking service is unavailable',
              });
            }),
          ),
      ),
      lastValueFrom(
        this.bookingClient
          .send<
            ReservationDto[],
            Record<string, never>
          >(RESERVATIONS_PATTERNS.FIND_ALL, {})
          .pipe(
            timeout(ReportsService.SERVICE_TIMEOUT),
            catchError((error: Error) => {
              if (error.name === 'TimeoutError') {
                throw new RpcException({
                  statusCode: 503,
                  message: 'Booking service request timed out',
                });
              }
              throw new RpcException({
                statusCode: 503,
                message: 'Booking service is unavailable',
              });
            }),
          ),
      ),
    ]);

    const totalRooms = rooms.length;

    if (totalRooms === 0) {
      return this.generateEmptyOccupancyData(year, month);
    }

    const filteredReservations = this.filterReservationsByPeriod(
      reservations,
      year,
      month,
    );

    return this.calculateOccupancyData(
      filteredReservations,
      totalRooms,
      year,
      month,
    );
  }

  private generateEmptyOccupancyData(
    year: number,
    month?: number,
  ): ReportOccupancyDataDto[] {
    if (month) {
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({ length: daysInMonth }).map((_, idx) => {
        const date = new Date(year, month - 1, idx + 1);
        date.setHours(0, 0, 0, 0);
        return {
          date,
          occupancyPercentage: 0,
          totalRevenue: 0,
        };
      });
    } else {
      return Array.from({ length: 12 }).map((_, idx) => {
        const date = new Date(year, idx, 1);
        date.setHours(0, 0, 0, 0);
        return {
          date,
          occupancyPercentage: 0,
          totalRevenue: 0,
        };
      });
    }
  }

  private filterReservationsByPeriod(
    reservations: ReservationDto[],
    year: number,
    month?: number,
  ): ReservationDto[] {
    const validStatuses = [
      ReservationStatus.CONFIRMED,
      ReservationStatus.CHECKED_IN,
      ReservationStatus.CHECKED_OUT,
    ];

    return reservations.filter((reservation) => {
      if (!validStatuses.includes(reservation.status)) {
        return false;
      }

      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      let periodStart: Date;
      let periodEnd: Date;

      if (month) {
        periodStart = new Date(year, month - 1, 1);
        periodEnd = new Date(year, month, 0, 23, 59, 59, 999);
      } else {
        periodStart = new Date(year, 0, 1);
        periodEnd = new Date(year, 11, 31, 23, 59, 59, 999);
      }

      return checkIn <= periodEnd && checkOut > periodStart;
    });
  }

  private calculateOccupancyData(
    reservations: ReservationDto[],
    totalRooms: number,
    year: number,
    month?: number,
  ): ReportOccupancyDataDto[] {
    if (month) {
      return this.calculateDailyOccupancy(
        reservations,
        totalRooms,
        year,
        month,
      );
    } else {
      return this.calculateMonthlyOccupancy(reservations, totalRooms, year);
    }
  }

  private calculateDailyOccupancy(
    reservations: ReservationDto[],
    totalRooms: number,
    year: number,
    month: number,
  ): ReportOccupancyDataDto[] {
    const daysInMonth = new Date(year, month, 0).getDate();
    const results: ReportOccupancyDataDto[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const occupiedRooms = this.countOccupiedRooms(
        reservations,
        dayStart,
        dayEnd,
      );

      const dailyRevenue = this.calculateDailyRevenue(
        reservations,
        dayStart,
        dayEnd,
      );

      const occupancyPercentage = Math.max(
        0,
        Math.min(
          100,
          Math.round((occupiedRooms / totalRooms) * 100 * 100) / 100,
        ),
      );

      results.push({
        date: dayStart,
        occupancyPercentage,
        totalRevenue: Math.round(dailyRevenue * 100) / 100,
      });
    }

    return results;
  }

  private calculateMonthlyOccupancy(
    reservations: ReservationDto[],
    totalRooms: number,
    year: number,
  ): ReportOccupancyDataDto[] {
    const results: ReportOccupancyDataDto[] = [];

    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
      const monthStart = new Date(year, monthIdx, 1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(year, monthIdx + 1, 0, 23, 59, 59, 999);
      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

      const totalRoomNights = totalRooms * daysInMonth;

      const occupiedRoomNights = this.calculateOccupiedRoomNights(
        reservations,
        monthStart,
        monthEnd,
      );

      const monthlyRevenue = this.calculateMonthlyRevenue(
        reservations,
        monthStart,
        monthEnd,
      );

      const occupancyPercentage =
        totalRoomNights > 0
          ? Math.max(
              0,
              Math.min(
                100,
                Math.round((occupiedRoomNights / totalRoomNights) * 100 * 100) /
                  100,
              ),
            )
          : 0;

      results.push({
        date: monthStart,
        occupancyPercentage,
        totalRevenue: Math.round(monthlyRevenue * 100) / 100,
      });
    }

    return results;
  }

  private countOccupiedRooms(
    reservations: ReservationDto[],
    dayStart: Date,
    dayEnd: Date,
  ): number {
    const occupiedRoomIds = new Set<number>();

    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      if (checkIn <= dayEnd && checkOut > dayStart) {
        occupiedRoomIds.add(reservation.roomId);
      }
    }

    return occupiedRoomIds.size;
  }

  private calculateOccupiedRoomNights(
    reservations: ReservationDto[],
    monthStart: Date,
    monthEnd: Date,
  ): number {
    let totalOccupiedNights = 0;

    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      if (checkIn <= monthEnd && checkOut > monthStart) {
        const overlapStart = checkIn > monthStart ? checkIn : monthStart;
        const overlapEnd = checkOut < monthEnd ? checkOut : monthEnd;

        const nights = Math.ceil(
          (overlapEnd.getTime() - overlapStart.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        totalOccupiedNights += Math.max(0, nights);
      }
    }

    return totalOccupiedNights;
  }

  private calculateDailyRevenue(
    reservations: ReservationDto[],
    dayStart: Date,
    dayEnd: Date,
  ): number {
    let totalRevenue = 0;

    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      if (checkIn <= dayEnd && checkOut > dayStart) {
        const nights = reservation.nights || 1;
        const dailyRate = (reservation.totalAmount || 0) / nights;
        totalRevenue += dailyRate;
      }
    }

    return totalRevenue;
  }

  private calculateMonthlyRevenue(
    reservations: ReservationDto[],
    monthStart: Date,
    monthEnd: Date,
  ): number {
    let totalRevenue = 0;

    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      if (checkIn <= monthEnd && checkOut > monthStart) {
        const overlapStart = checkIn > monthStart ? checkIn : monthStart;
        const overlapEnd = checkOut < monthEnd ? checkOut : monthEnd;

        const nightsInMonth = Math.ceil(
          (overlapEnd.getTime() - overlapStart.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        const totalNights = reservation.nights || 1;
        const dailyRate = (reservation.totalAmount || 0) / totalNights;
        totalRevenue += dailyRate * Math.max(0, nightsInMonth);
      }
    }

    return totalRevenue;
  }

  async getMonthlyRevenueComparison(
    year: number,
  ): Promise<MonthlyRevenueDto[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    const invoices = await lastValueFrom(
      this.billingClient
        .send<InvoiceDto[], { startDate: Date; endDate: Date }>(
          INVOICES_PATTERNS.FIND_BY_DATE_RANGE,
          {
            startDate,
            endDate,
          },
        )
        .pipe(
          timeout(ReportsService.SERVICE_TIMEOUT),
          catchError((error: Error) => {
            if (error.name === 'TimeoutError') {
              throw new RpcException({
                statusCode: 503,
                message: 'Billing service request timed out',
              });
            }
            throw new RpcException({
              statusCode: 503,
              message: 'Billing service is unavailable',
            });
          }),
        ),
    );

    return this.aggregateInvoicesByMonth(invoices, year);
  }

  private aggregateInvoicesByMonth(
    invoices: InvoiceDto[],
    year: number,
  ): MonthlyRevenueDto[] {
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthlyData: Map<number, { revenue: number; expenses: number }> =
      new Map();
    for (let i = 0; i < 12; i++) {
      monthlyData.set(i, { revenue: 0, expenses: 0 });
    }

    for (const invoice of invoices) {
      const invoiceDate = new Date(invoice.createdAt);

      if (invoiceDate.getFullYear() !== year) {
        continue;
      }

      const monthIndex = invoiceDate.getMonth();
      const currentData = monthlyData.get(monthIndex)!;

      const invoiceRevenue = this.calculateInvoiceRevenue(invoice);

      const invoiceExpenses = Number(invoice.taxes) || 0;

      currentData.revenue += invoiceRevenue;
      currentData.expenses += invoiceExpenses;
    }

    return monthNames.map((monthName, index) => {
      const data = monthlyData.get(index)!;
      const revenue = Math.round(data.revenue * 100) / 100;
      const expenses = Math.round(data.expenses * 100) / 100;
      const profit = Math.round((revenue - expenses) * 100) / 100;

      return {
        month: monthName,
        revenue,
        expenses,
        profit,
      };
    });
  }

  private calculateInvoiceRevenue(invoice: InvoiceDto): number {
    if (!invoice.invoiceItems || invoice.invoiceItems.length === 0) {
      return Number(invoice.total) || 0;
    }

    return invoice.invoiceItems.reduce((sum, item) => {
      return sum + (Number(item.total) || 0);
    }, 0);
  }

  async generateFinancialReportPdf(
    year: number,
    month?: number,
  ): Promise<FinancialReportPdfDto> {
    const startDate = month
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    const endDate = month
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(year, 11, 31, 23, 59, 59);

    const [financialSummary, occupancyData, monthlyRevenue] = await Promise.all(
      [
        this.getFinancialSummary(startDate, endDate),
        this.getOccupancyByMonthYear(year, month),
        this.getMonthlyRevenueComparison(year),
      ],
    );

    const buffer = await this.buildPdfDocument(
      financialSummary,
      occupancyData,
      monthlyRevenue,
      year,
      month,
    );

    const filename = `financial-report-${year}${month ? `-${month}` : ''}.pdf`;

    return { buffer, filename };
  }

  private buildPdfDocument(
    financialSummary: FinancialSummaryDto,
    occupancyData: ReportOccupancyDataDto[],
    monthlyRevenue: MonthlyRevenueDto[],
    year: number,
    month?: number,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('Hotelier Suite', { align: 'center' });
      doc
        .fontSize(18)
        .text('Financial and Occupancy Report', { align: 'center' });
      doc.moveDown();

      const periodText = month
        ? `${this.getMonthName(month)} ${year}`
        : `Year ${year}`;
      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`Period: ${periodText}`, { align: 'center' });
      doc.text(`Generation date: ${new Date().toLocaleDateString('en')}`, {
        align: 'center',
      });
      doc.moveDown(2);

      doc.fontSize(16).font('Helvetica-Bold').text('Financial Summary');
      doc.moveDown();

      const summaryData = [
        ['Concept', 'Amount'],
        ['Total Revenue', `${financialSummary.revenue.total.toLocaleString()}`],
        ['  - Rooms', `${financialSummary.revenue.room.toLocaleString()}`],
        [
          '  - Restaurant',
          `${financialSummary.revenue.restaurant.toLocaleString()}`,
        ],
        [
          '  - Additional Services',
          `${financialSummary.revenue.services.toLocaleString()}`,
        ],
        ['  - Events', `${financialSummary.revenue.events.toLocaleString()}`],
        ['Expenses', `-${financialSummary.expenses.toLocaleString()}`],
        ['Gross Profit', `${financialSummary.grossProfit.toLocaleString()}`],
        ['Profit Margin', `${financialSummary.profitMargin.toFixed(1)}%`],
      ];

      this.drawTable(doc, summaryData);
      doc.moveDown(2);

      if (occupancyData.length > 0) {
        doc.fontSize(16).font('Helvetica-Bold').text('Occupancy Data');
        doc.moveDown();

        const avgOccupancy =
          occupancyData.reduce(
            (sum, item) => sum + item.occupancyPercentage,
            0,
          ) / occupancyData.length;
        const totalOccupancyRevenue = occupancyData.reduce(
          (sum, item) => sum + item.totalRevenue,
          0,
        );

        doc
          .fontSize(12)
          .font('Helvetica')
          .text(`Average Occupancy: ${avgOccupancy.toFixed(1)}%`)
          .text(`Occupancy Revenue: ${totalOccupancyRevenue.toLocaleString()}`)
          .text(`Days with Data: ${occupancyData.length}`);
        doc.moveDown();
      }

      if (!month && monthlyRevenue.length > 0) {
        doc.addPage();
        doc
          .fontSize(16)
          .font('Helvetica-Bold')
          .text('Monthly Revenue Comparison');
        doc.moveDown();

        const monthlyTableData = [
          ['Month', 'Revenue', 'Expenses', 'Profit'],
          ...monthlyRevenue.map((item) => [
            item.month,
            `${item.revenue.toLocaleString()}`,
            `${item.expenses.toLocaleString()}`,
            `${item.profit.toLocaleString()}`,
          ]),
        ];

        this.drawTable(doc, monthlyTableData);
      }

      doc.end();
    });
  }

  private drawTable(doc: PDFKit.PDFDocument, data: string[][]) {
    const startX = 50;
    let startY = doc.y;
    const columnWidth = 250;
    const rowHeight = 20;

    doc.font('Helvetica-Bold').fontSize(11);
    data[0].forEach((header, index) => {
      doc.text(header, startX + index * columnWidth, startY, {
        width: columnWidth,
      });
    });

    startY += rowHeight;
    doc
      .moveTo(startX, startY)
      .lineTo(startX + columnWidth * data[0].length, startY)
      .stroke();
    startY += 5;

    doc.font('Helvetica').fontSize(10);
    for (let i = 1; i < data.length; i++) {
      data[i].forEach((cell, index) => {
        doc.text(cell, startX + index * columnWidth, startY, {
          width: columnWidth,
        });
      });
      startY += rowHeight;
    }

    doc.y = startY;
  }

  private getMonthName(month: number): string {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    return months[month - 1];
  }
}
