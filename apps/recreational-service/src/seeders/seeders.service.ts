import { Injectable } from '@nestjs/common';
import {
  RecreationalFacilitiesSeeder,
  RecreationalBookingsSeeder,
} from './domains';

@Injectable()
export class SeedersService {
  constructor(
    private recreationalFacilitiesSeeder: RecreationalFacilitiesSeeder,
    private recreationalBookingsSeeder: RecreationalBookingsSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting seeding of Recreational Service...');

    // Seed facilities first
    await this.recreationalFacilitiesSeeder.seed();
    console.log('✅ Recreational facilities seeded');

    // Then seed bookings
    await this.recreationalBookingsSeeder.seed();
    console.log('✅ Recreational bookings seeded');

    console.log('🎉 Recreational Service seeding completed!');
  }
}
