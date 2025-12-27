import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../reports';
import { ReportType, ReportStatus } from '@app/contracts/reports-service';

@Injectable()
export class ReportsSeeder {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async seed() {
    const count = await this.reportRepository.count();
    if (count > 0) {
      console.log('📊 Reports already seeded, skipping...');
      return;
    }

    console.log('📊 Seeding reports...');

    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

    const reports: Partial<Report>[] = [
      {
        title: `Monthly Occupancy Report - ${lastMonth.toLocaleString('en', { month: 'long', year: 'numeric' })}`,
        type: ReportType.OCCUPANCY,
        status: ReportStatus.COMPLETED,
        startDate: lastMonth,
        endDate: lastMonthEnd,
        parameters: {
          reportType: 'occupancy',
          dateRange: { startDate: lastMonth, endDate: lastMonthEnd },
        },
        data: {
          totalRooms: 45,
          occupiedRooms: 38,
          availableRooms: 7,
          occupancyRate: 84.4,
          averageDailyRate: 125.5,
          revenuePerAvailableRoom: 105.9,
          checkInsToday: 12,
          checkOutsToday: 8,
        },
        generatedBy: 'system@hotel.com',
      },
      {
        title: `Monthly Revenue Report - ${lastMonth.toLocaleString('en', { month: 'long', year: 'numeric' })}`,
        type: ReportType.REVENUE,
        status: ReportStatus.COMPLETED,
        startDate: lastMonth,
        endDate: lastMonthEnd,
        parameters: {
          reportType: 'revenue',
          dateRange: { startDate: lastMonth, endDate: lastMonthEnd },
        },
        data: {
          totalRevenue: 125000.0,
          roomRevenue: 95000.0,
          serviceRevenue: 20000.0,
          otherRevenue: 10000.0,
          averageRevenuePerRoom: 2777.78,
          dailyBreakdown: [
            {
              date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
              revenue: 4200.0,
            },
            {
              date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 15),
              revenue: 4500.0,
            },
            {
              date: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 28),
              revenue: 4100.0,
            },
          ],
        },
        generatedBy: 'system@hotel.com',
      },
      {
        title: `Guest Satisfaction Report - ${lastMonth.toLocaleString('en', { month: 'long', year: 'numeric' })}`,
        type: ReportType.GUEST_SATISFACTION,
        status: ReportStatus.COMPLETED,
        startDate: lastMonth,
        endDate: lastMonthEnd,
        parameters: {
          reportType: 'guest_satisfaction',
          dateRange: { startDate: lastMonth, endDate: lastMonthEnd },
        },
        data: {
          totalReviews: 120,
          averageRating: 4.5,
          fiveStarReviews: 70,
          fourStarReviews: 38,
          threeStarReviews: 8,
          twoStarReviews: 3,
          oneStarReviews: 1,
          netPromoterScore: 72,
          responseRate: 85.0,
        },
        generatedBy: 'system@hotel.com',
      },
      {
        title: 'Pending Financial Report',
        type: ReportType.FINANCIAL,
        status: ReportStatus.PENDING,
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: now,
        parameters: {
          reportType: 'financial',
          dateRange: {
            startDate: new Date(now.getFullYear(), now.getMonth(), 1),
            endDate: now,
          },
        },
        generatedBy: 'admin@hotel.com',
      },
    ];

    await this.reportRepository.save(reports);
    console.log(`📊 Seeded ${reports.length} reports`);
  }
}
