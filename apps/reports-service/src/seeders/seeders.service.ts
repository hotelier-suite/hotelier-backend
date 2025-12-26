import { Injectable } from '@nestjs/common';
import { ReportsSeeder, AnalyticsSeeder } from './domains';

@Injectable()
export class SeedersService {
  constructor(
    private reportsSeeder: ReportsSeeder,
    private analyticsSeeder: AnalyticsSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting Reports service seeding...');

    await this.reportsSeeder.seed();
    await this.analyticsSeeder.seed();

    console.log('🎉 Reports service seeding completed!');
  }
}
