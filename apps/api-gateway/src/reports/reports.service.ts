import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Report } from './entities/report.entity';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportType } from './enums/report-type.enum';
import { ReportStatus } from './enums/report-status.enum';
import { Invoice } from '../billing/entities/invoice.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { InvoiceStatus } from '../billing/enums/invoice-status.enum';
import { ReservationStatus } from '../reservations/enums/reservation-status.enum';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Invoice)
    private readonly invoiceRepository: Repository<Invoice>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async create(data: CreateReportDto): Promise<Report> {
    return this.reportRepository.save({
      ...data,
      status: data.status || ReportStatus.PENDING,
    });
  }

  async findAll(): Promise<Report[]> {
    return this.reportRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Report | null> {
    return this.reportRepository.findOne({
      where: { id },
    });
  }

  async findByType(type: ReportType): Promise<Report[]> {
    return this.reportRepository.find({
      where: { type },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: ReportStatus): Promise<Report[]> {
    return this.reportRepository.find({
      where: { status },
      order: { createdAt: 'DESC' },
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Report[]> {
    return this.reportRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, status: ReportStatus): Promise<Report> {
    await this.reportRepository.update(id, { status });
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return updated;
  }

  async update(id: number, data: UpdateReportDto): Promise<Report> {
    await this.reportRepository.update(id, data);
    const updated = await this.findOne(id);
    if (!updated) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: number): Promise<Report> {
    const report = await this.findOne(id);
    if (!report) {
      throw new NotFoundException(`Report with id ${id} not found`);
    }
    await this.reportRepository.remove(report);
    return report;
  }

  async generateOccupancyReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<Report> {
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
  ): Promise<Report> {
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

  async generateGuestReport(
    startDate: Date,
    endDate: Date,
    generatedBy: string,
  ): Promise<Report> {
    return this.create({
      title: `Guest Report ${startDate.toDateString()} - ${endDate.toDateString()}`,
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

  async getFinancialSummary(
    startDate: Date,
    endDate: Date,
  ): Promise<{
    revenue: {
      room: number;
      restaurant: number;
      services: number;
      events: number;
      total: number;
    };
    expenses: number;
    grossProfit: number;
    profitMargin: number;
  }> {
    // Get all paid invoices within date range
    const invoices = await this.invoiceRepository.find({
      where: {
        issueDate: Between(startDate, endDate),
        status: InvoiceStatus.PAID,
      },
      relations: ['invoiceItems', 'reservation'],
    });

    // Calculate revenue breakdown
    let roomRevenue = 0;
    let restaurantRevenue = 0;
    let servicesRevenue = 0;
    let eventsRevenue = 0;

    for (const invoice of invoices) {
      for (const item of invoice.invoiceItems || []) {
        const amount = Number(item.total);
        const description = item.description.toLowerCase();

        if (description.includes('room') || description.includes('room')) {
          roomRevenue += amount;
        } else if (
          description.includes('restaurant') ||
          description.includes('food')
        ) {
          restaurantRevenue += amount;
        } else if (description.includes('event')) {
          eventsRevenue += amount;
        } else {
          servicesRevenue += amount;
        }
      }
    }

    const totalRevenue =
      roomRevenue + restaurantRevenue + servicesRevenue + eventsRevenue;

    // Estimate expenses as 40% of revenue (simplified)
    const expenses = totalRevenue * 0.4;
    const grossProfit = totalRevenue - expenses;
    const profitMargin =
      totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

    return {
      revenue: {
        room: Math.round(roomRevenue * 100) / 100,
        restaurant: Math.round(restaurantRevenue * 100) / 100,
        services: Math.round(servicesRevenue * 100) / 100,
        events: Math.round(eventsRevenue * 100) / 100,
        total: Math.round(totalRevenue * 100) / 100,
      },
      expenses: Math.round(expenses * 100) / 100,
      grossProfit: Math.round(grossProfit * 100) / 100,
      profitMargin: Math.round(profitMargin * 100) / 100,
    };
  }

  async getOccupancyByMonthYear(
    year: number,
    month?: number,
  ): Promise<
    Array<{ date: string; occupancyPercentage: number; totalRevenue: number }>
  > {
    const startDate = new Date(year, month ? month - 1 : 0, 1);
    const endDate = month
      ? new Date(year, month, 0) // Last day of specific month
      : new Date(year, 11, 31); // Last day of year

    const reservations = await this.reservationRepository.find({
      where: [
        {
          checkInDate: Between(startDate, endDate),
          status: ReservationStatus.CONFIRMED,
        },
        {
          checkInDate: Between(startDate, endDate),
          status: ReservationStatus.CHECKED_IN,
        },
        {
          checkInDate: Between(startDate, endDate),
          status: ReservationStatus.CHECKED_OUT,
        },
      ],
      relations: ['room'],
    });

    // Group by date
    const occupancyMap = new Map<string, { count: number; revenue: number }>();
    const totalRooms = 45; // Assuming 45 total rooms

    for (const reservation of reservations) {
      const date = reservation.checkInDate.toISOString().split('T')[0];
      const existing = occupancyMap.get(date) || { count: 0, revenue: 0 };
      occupancyMap.set(date, {
        count: existing.count + 1,
        revenue: existing.revenue + Number(reservation.totalAmount || 0),
      });
    }

    return Array.from(occupancyMap.entries())
      .map(([date, data]) => ({
        date,
        occupancyPercentage:
          Math.round((data.count / totalRooms) * 100 * 100) / 100,
        totalRevenue: Math.round(data.revenue * 100) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  async getMonthlyRevenueComparison(
    year: number,
  ): Promise<
    Array<{ month: string; revenue: number; expenses: number; profit: number }>
  > {
    const monthlyData: Array<{
      month: string;
      revenue: number;
      expenses: number;
      profit: number;
    }> = [];

    for (let month = 1; month <= 12; month++) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const financial = await this.getFinancialSummary(startDate, endDate);

      monthlyData.push({
        month: startDate.toLocaleString('en', { month: 'short' }),
        revenue: financial.revenue.total,
        expenses: financial.expenses,
        profit: financial.grossProfit,
      });
    }

    return monthlyData;
  }

  async generateFinancialReportPDF(
    year: number,
    month?: number,
  ): Promise<StreamableFile> {
    // Get data for the report
    const startDate = month
      ? new Date(year, month - 1, 1)
      : new Date(year, 0, 1);
    const endDate = month
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(year, 11, 31, 23, 59, 59);

    const financialSummary = await this.getFinancialSummary(startDate, endDate);
    const occupancyData = await this.getOccupancyByMonthYear(year, month);
    const monthlyRevenue = await this.getMonthlyRevenueComparison(year);

    // Create PDF
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    return new Promise((resolve, reject) => {
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));

      doc.on('end', () => {
        const result = Buffer.concat(chunks);
        const file = new StreamableFile(result, {
          type: 'application/pdf',
          disposition: `attachment; filename="financial-report-${year}${month ? `-${month}` : ''}.pdf"`,
        });
        resolve(file);
      });

      doc.on('error', reject);

      // Header
      doc
        .fontSize(24)
        .font('Helvetica-Bold')
        .text('Hotelier Suite', { align: 'center' });
      doc
        .fontSize(18)
        .text('Financial and Occupancy Report', { align: 'center' });
      doc.moveDown();
      doc
        .fontSize(12)
        .font('Helvetica')
        .text(
          `Period: ${month ? `${this.getMonthName(month)} ${year}` : `Year ${year}`}`,
          { align: 'center' },
        );
      doc.text(`Generation date: ${new Date().toLocaleDateString('en')}`, {
        align: 'center',
      });
      doc.moveDown(2);

      // Financial Summary Section
      doc.fontSize(16).font('Helvetica-Bold').text('Financial Summary');
      doc.moveDown();

      const summaryData = [
        ['Concept', 'Amount'],
        [
          'Total Revenue',
          `$${financialSummary.revenue.total.toLocaleString()}`,
        ],
        ['  - Rooms', `$${financialSummary.revenue.room.toLocaleString()}`],
        [
          '  - Restaurant',
          `$${financialSummary.revenue.restaurant.toLocaleString()}`,
        ],
        [
          '  - Additional Services',
          `$${financialSummary.revenue.services.toLocaleString()}`,
        ],
        ['  - Events', `$${financialSummary.revenue.events.toLocaleString()}`],
        ['Expenses', `-$${financialSummary.expenses.toLocaleString()}`],
        ['Gross Profit', `$${financialSummary.grossProfit.toLocaleString()}`],
        ['Profit Margin', `${financialSummary.profitMargin.toFixed(1)}%`],
      ];

      this.drawTable(doc, summaryData);
      doc.moveDown(2);

      // Occupancy Section
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
          .text(`Occupancy Revenue: $${totalOccupancyRevenue.toLocaleString()}`)
          .text(`Days with Data: ${occupancyData.length}`);
        doc.moveDown();
      }

      // Monthly Revenue Comparison Section
      if (!month && monthlyRevenue.length > 0) {
        // Start a new page for the monthly comparison
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
            `$${item.revenue.toLocaleString()}`,
            `$${item.expenses.toLocaleString()}`,
            `$${item.profit.toLocaleString()}`,
          ]),
        ];

        this.drawTable(doc, monthlyTableData);
      }

      // End the document
      doc.end();
    });
  }

  private drawTable(doc: PDFKit.PDFDocument, data: string[][]) {
    const startX = 50;
    let startY = doc.y;
    const columnWidth = 250;
    const rowHeight = 20;

    // Draw header
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

    // Draw rows
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
