import {
  Injectable,
  NotFoundException,
  Inject,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, of, timeout, catchError } from 'rxjs';
import { Report } from './entities';
import {
  CreateReportDto,
  UpdateReportDto,
  ReportType,
  ReportStatus,
  ReportDto,
  FinancialSummaryDto,
  OccupancyDataDto,
  MonthlyRevenueDto,
} from '@app/contracts/reports-service';
import {
  STATISTICS_PATTERNS,
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
    return this.reportRepository.save(report) as Promise<ReportDto>;
  }

  async findAll(): Promise<ReportDto[]> {
    return this.reportRepository.find({
      order: { createdAt: 'DESC' },
    }) as Promise<ReportDto[]>;
  }

  async findOne(id: number): Promise<ReportDto> {
    const report = await this.reportRepository.findOne({
      where: { id },
    });
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return report as ReportDto;
  }

  async findByType(type: ReportType): Promise<ReportDto[]> {
    return this.reportRepository.find({
      where: { type },
      order: { createdAt: 'DESC' },
    }) as Promise<ReportDto[]>;
  }

  async findByStatus(status: ReportStatus): Promise<ReportDto[]> {
    return this.reportRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    }) as Promise<ReportDto[]>;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<ReportDto[]> {
    return this.reportRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'DESC' },
    }) as Promise<ReportDto[]>;
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
    // Query billing service for financial summary
    const [financialSummary, invoices] = await Promise.all([
      lastValueFrom(
        this.billingClient
          .send<
            FinancialSummaryResponseDto,
            { startDate: string; endDate: string }
          >(STATISTICS_PATTERNS.FINANCIAL_SUMMARY, {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          })
          .pipe(
            timeout(ReportsService.SERVICE_TIMEOUT),
            catchError((error: Error) => {
              if (error.name === 'TimeoutError') {
                throw new ServiceUnavailableException(
                  'Billing service request timed out',
                );
              }
              throw new ServiceUnavailableException(
                'Billing service is unavailable',
              );
            }),
          ),
      ),
      lastValueFrom(
        this.billingClient
          .send<InvoiceDto[], { startDate: string; endDate: string }>(
            INVOICES_PATTERNS.FIND_BY_DATE_RANGE,
            {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
          )
          .pipe(
            timeout(ReportsService.SERVICE_TIMEOUT),
            catchError(() => of([] as InvoiceDto[])),
          ),
      ),
    ]);

    // Categorize revenue from invoices
    const revenueByCategory = this.categorizeRevenue(invoices);

    // Calculate total revenue as sum of categories
    const totalRevenue =
      revenueByCategory.room +
      revenueByCategory.restaurant +
      revenueByCategory.services +
      revenueByCategory.events;

    // Use paid amount as a proxy for expenses calculation (simplified)
    // In a real scenario, expenses would come from a separate service
    const expenses = financialSummary.pendingAmount || 0;

    // Calculate gross profit and profit margin
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

  /**
   * Categorizes invoice revenue by type based on invoice item descriptions.
   * Categories: room, restaurant, services, events
   */
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
          // Default to services for uncategorized items
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
  ): Promise<OccupancyDataDto[]> {
    // Query booking-service for rooms and reservations
    const [rooms, reservations] = await Promise.all([
      lastValueFrom(
        this.bookingClient
          .send<RoomDto[], Record<string, never>>(ROOMS_PATTERNS.FIND_ALL, {})
          .pipe(
            timeout(ReportsService.SERVICE_TIMEOUT),
            catchError((error: Error) => {
              if (error.name === 'TimeoutError') {
                throw new ServiceUnavailableException(
                  'Booking service request timed out',
                );
              }
              throw new ServiceUnavailableException(
                'Booking service is unavailable',
              );
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
                throw new ServiceUnavailableException(
                  'Booking service request timed out',
                );
              }
              throw new ServiceUnavailableException(
                'Booking service is unavailable',
              );
            }),
          ),
      ),
    ]);

    const totalRooms = rooms.length;

    // If no rooms, return empty occupancy data
    if (totalRooms === 0) {
      return this.generateEmptyOccupancyData(year, month);
    }

    // Filter reservations by year and optional month
    const filteredReservations = this.filterReservationsByPeriod(
      reservations,
      year,
      month,
    );

    // Calculate occupancy data for each period
    return this.calculateOccupancyData(
      filteredReservations,
      totalRooms,
      year,
      month,
    );
  }

  /**
   * Generates empty occupancy data for the specified period
   */
  private generateEmptyOccupancyData(
    year: number,
    month?: number,
  ): OccupancyDataDto[] {
    if (month) {
      // Return daily data for the specific month
      const daysInMonth = new Date(year, month, 0).getDate();
      return Array.from({ length: daysInMonth }).map((_, idx) => {
        const date = new Date(year, month - 1, idx + 1);
        return {
          date: date.toISOString().split('T')[0],
          occupancyPercentage: 0,
          totalRevenue: 0,
        };
      });
    } else {
      // Return monthly data for the entire year
      return Array.from({ length: 12 }).map((_, idx) => {
        const date = new Date(year, idx, 1);
        return {
          date: date.toISOString().split('T')[0],
          occupancyPercentage: 0,
          totalRevenue: 0,
        };
      });
    }
  }

  /**
   * Filters reservations by year and optional month
   * Only includes confirmed, checked-in, or checked-out reservations
   */
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
      // Only include valid reservation statuses
      if (!validStatuses.includes(reservation.status)) {
        return false;
      }

      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      // Define the period boundaries
      let periodStart: Date;
      let periodEnd: Date;

      if (month) {
        // Specific month
        periodStart = new Date(year, month - 1, 1);
        periodEnd = new Date(year, month, 0, 23, 59, 59, 999);
      } else {
        // Entire year
        periodStart = new Date(year, 0, 1);
        periodEnd = new Date(year, 11, 31, 23, 59, 59, 999);
      }

      // Check if reservation overlaps with the period
      return checkIn <= periodEnd && checkOut > periodStart;
    });
  }

  /**
   * Calculates occupancy data for each period (day or month)
   */
  private calculateOccupancyData(
    reservations: ReservationDto[],
    totalRooms: number,
    year: number,
    month?: number,
  ): OccupancyDataDto[] {
    if (month) {
      // Calculate daily occupancy for the specific month
      return this.calculateDailyOccupancy(
        reservations,
        totalRooms,
        year,
        month,
      );
    } else {
      // Calculate monthly occupancy for the entire year
      return this.calculateMonthlyOccupancy(reservations, totalRooms, year);
    }
  }

  /**
   * Calculates daily occupancy for a specific month
   */
  private calculateDailyOccupancy(
    reservations: ReservationDto[],
    totalRooms: number,
    year: number,
    month: number,
  ): OccupancyDataDto[] {
    const daysInMonth = new Date(year, month, 0).getDate();
    const results: OccupancyDataDto[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month - 1, day);
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      // Count reservations that overlap with this day
      const occupiedRooms = this.countOccupiedRooms(
        reservations,
        dayStart,
        dayEnd,
      );

      // Calculate revenue for this day
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
        date: currentDate.toISOString().split('T')[0],
        occupancyPercentage,
        totalRevenue: Math.round(dailyRevenue * 100) / 100,
      });
    }

    return results;
  }

  /**
   * Calculates monthly occupancy for an entire year
   */
  private calculateMonthlyOccupancy(
    reservations: ReservationDto[],
    totalRooms: number,
    year: number,
  ): OccupancyDataDto[] {
    const results: OccupancyDataDto[] = [];

    for (let monthIdx = 0; monthIdx < 12; monthIdx++) {
      const monthStart = new Date(year, monthIdx, 1);
      const monthEnd = new Date(year, monthIdx + 1, 0, 23, 59, 59, 999);
      const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();

      // Calculate total room-nights available
      const totalRoomNights = totalRooms * daysInMonth;

      // Calculate occupied room-nights for the month
      const occupiedRoomNights = this.calculateOccupiedRoomNights(
        reservations,
        monthStart,
        monthEnd,
      );

      // Calculate revenue for this month
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
        date: monthStart.toISOString().split('T')[0],
        occupancyPercentage,
        totalRevenue: Math.round(monthlyRevenue * 100) / 100,
      });
    }

    return results;
  }

  /**
   * Counts the number of rooms occupied on a specific day
   */
  private countOccupiedRooms(
    reservations: ReservationDto[],
    dayStart: Date,
    dayEnd: Date,
  ): number {
    // Use a Set to count unique rooms occupied on this day
    const occupiedRoomIds = new Set<number>();

    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      // Check if reservation overlaps with this day
      if (checkIn <= dayEnd && checkOut > dayStart) {
        occupiedRoomIds.add(reservation.roomId);
      }
    }

    return occupiedRoomIds.size;
  }

  /**
   * Calculates occupied room-nights for a month
   */
  private calculateOccupiedRoomNights(
    reservations: ReservationDto[],
    monthStart: Date,
    monthEnd: Date,
  ): number {
    let totalOccupiedNights = 0;

    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      // Check if reservation overlaps with this month
      if (checkIn <= monthEnd && checkOut > monthStart) {
        // Calculate the overlap period
        const overlapStart = checkIn > monthStart ? checkIn : monthStart;
        const overlapEnd = checkOut < monthEnd ? checkOut : monthEnd;

        // Calculate nights in this month
        const nights = Math.ceil(
          (overlapEnd.getTime() - overlapStart.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        totalOccupiedNights += Math.max(0, nights);
      }
    }

    return totalOccupiedNights;
  }

  /**
   * Calculates daily revenue from reservations
   */
  private calculateDailyRevenue(
    reservations: ReservationDto[],
    dayStart: Date,
    dayEnd: Date,
  ): number {
    let totalRevenue = 0;

    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      // Check if reservation overlaps with this day
      if (checkIn <= dayEnd && checkOut > dayStart) {
        // Calculate daily rate from total amount and nights
        const nights = reservation.nights || 1;
        const dailyRate = (reservation.totalAmount || 0) / nights;
        totalRevenue += dailyRate;
      }
    }

    return totalRevenue;
  }

  /**
   * Calculates monthly revenue from reservations
   */
  private calculateMonthlyRevenue(
    reservations: ReservationDto[],
    monthStart: Date,
    monthEnd: Date,
  ): number {
    let totalRevenue = 0;

    for (const reservation of reservations) {
      const checkIn = new Date(reservation.checkInDate);
      const checkOut = new Date(reservation.checkOutDate);

      // Check if reservation overlaps with this month
      if (checkIn <= monthEnd && checkOut > monthStart) {
        // Calculate the overlap period
        const overlapStart = checkIn > monthStart ? checkIn : monthStart;
        const overlapEnd = checkOut < monthEnd ? checkOut : monthEnd;

        // Calculate nights in this month
        const nightsInMonth = Math.ceil(
          (overlapEnd.getTime() - overlapStart.getTime()) /
            (1000 * 60 * 60 * 24),
        );

        // Calculate proportional revenue
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
    // Define date range for the entire year
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

    // Query billing-service for invoices within the year
    const invoices = await lastValueFrom(
      this.billingClient
        .send<InvoiceDto[], { startDate: string; endDate: string }>(
          INVOICES_PATTERNS.FIND_BY_DATE_RANGE,
          {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
          },
        )
        .pipe(
          timeout(ReportsService.SERVICE_TIMEOUT),
          catchError((error: Error) => {
            if (error.name === 'TimeoutError') {
              throw new ServiceUnavailableException(
                'Billing service request timed out',
              );
            }
            throw new ServiceUnavailableException(
              'Billing service is unavailable',
            );
          }),
        ),
    );

    // Aggregate invoices by month
    return this.aggregateInvoicesByMonth(invoices, year);
  }

  /**
   * Aggregates invoices by month and calculates revenue, expenses, and profit
   * Returns an array of 12 MonthlyRevenueDto entries (one per month)
   */
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

    // Initialize monthly data with zeros
    const monthlyData: Map<number, { revenue: number; expenses: number }> =
      new Map();
    for (let i = 0; i < 12; i++) {
      monthlyData.set(i, { revenue: 0, expenses: 0 });
    }

    // Group invoices by month and calculate totals
    for (const invoice of invoices) {
      const invoiceDate = new Date(invoice.createdAt);

      // Only process invoices from the specified year
      if (invoiceDate.getFullYear() !== year) {
        continue;
      }

      const monthIndex = invoiceDate.getMonth();
      const currentData = monthlyData.get(monthIndex)!;

      // Calculate revenue from invoice items
      const invoiceRevenue = this.calculateInvoiceRevenue(invoice);

      // Use taxes as a proxy for expenses (simplified model)
      // In a real scenario, expenses would come from a separate data source
      const invoiceExpenses = Number(invoice.taxes) || 0;

      currentData.revenue += invoiceRevenue;
      currentData.expenses += invoiceExpenses;
    }

    // Convert to MonthlyRevenueDto array
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

  /**
   * Calculates total revenue from an invoice's items
   */
  private calculateInvoiceRevenue(invoice: InvoiceDto): number {
    if (!invoice.invoiceItems || invoice.invoiceItems.length === 0) {
      // Fall back to total amount if no items
      return Number(invoice.total) || 0;
    }

    return invoice.invoiceItems.reduce((sum, item) => {
      return sum + (Number(item.total) || 0);
    }, 0);
  }

  async generateFinancialReportPdfData(
    year: number,
    month?: number,
  ): Promise<{
    financialSummary: FinancialSummaryDto;
    occupancyData: OccupancyDataDto[];
    monthlyRevenue: MonthlyRevenueDto[];
    year: number;
    month?: number;
  }> {
    const startDate = month
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    const endDate = month
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(year, 11, 31, 23, 59, 59);

    const financialSummary = await this.getFinancialSummary(startDate, endDate);
    const occupancyData = await this.getOccupancyByMonthYear(year, month);
    const monthlyRevenue = await this.getMonthlyRevenueComparison(year);

    return {
      financialSummary,
      occupancyData,
      monthlyRevenue,
      year,
      month,
    };
  }
}
