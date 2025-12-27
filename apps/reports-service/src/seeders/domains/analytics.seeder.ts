import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnalyticsData } from '../../analytics';
import { AnalyticsMetric } from '@app/contracts/reports-service';

@Injectable()
export class AnalyticsSeeder {
  constructor(
    @InjectRepository(AnalyticsData)
    private readonly analyticsRepository: Repository<AnalyticsData>,
  ) {}

  async seed() {
    const count = await this.analyticsRepository.count();
    if (count > 0) {
      console.log('📈 Analytics data already seeded, skipping...');
      return;
    }

    console.log('📈 Seeding analytics data...');

    const analyticsData: Partial<AnalyticsData>[] = [];
    const now = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);

      analyticsData.push({
        metric: AnalyticsMetric.OCCUPANCY_RATE,
        value: 70 + Math.random() * 25,
        date,
        period: `${date.toLocaleString('en', { month: 'short' })}-${date.getFullYear()}`,
        metadata: { source: 'automated', department: 'front-desk' },
      });

      analyticsData.push({
        metric: AnalyticsMetric.REVENUE_PER_ROOM,
        value: 100 + Math.random() * 100,
        date,
        period: `${date.toLocaleString('en', { month: 'short' })}-${date.getFullYear()}`,
        metadata: { source: 'automated', department: 'finance' },
      });

      analyticsData.push({
        metric: AnalyticsMetric.CUSTOMER_SATISFACTION,
        value: 3.5 + Math.random() * 1.5,
        date,
        period: `${date.toLocaleString('en', { month: 'short' })}-${date.getFullYear()}`,
        metadata: { source: 'surveys', department: 'guest-relations' },
      });

      analyticsData.push({
        metric: AnalyticsMetric.AVERAGE_STAY_LENGTH,
        value: 1.5 + Math.random() * 3.5,
        date,
        period: `${date.toLocaleString('en', { month: 'short' })}-${date.getFullYear()}`,
        metadata: { source: 'automated', department: 'reservations' },
      });

      analyticsData.push({
        metric: AnalyticsMetric.REPEAT_CUSTOMER_RATE,
        value: 20 + Math.random() * 25,
        date,
        period: `${date.toLocaleString('en', { month: 'short' })}-${date.getFullYear()}`,
        metadata: { source: 'automated', department: 'marketing' },
      });

      analyticsData.push({
        metric: AnalyticsMetric.STAFF_EFFICIENCY,
        value: 75 + Math.random() * 23,
        date,
        period: `${date.toLocaleString('en', { month: 'short' })}-${date.getFullYear()}`,
        metadata: { source: 'automated', department: 'hr' },
      });
    }

    await this.analyticsRepository.save(analyticsData);
    console.log(`📈 Seeded ${analyticsData.length} analytics data points`);
  }
}
