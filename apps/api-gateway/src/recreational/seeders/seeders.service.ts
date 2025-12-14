import { Injectable } from '@nestjs/common';
import { RecreationalFacilitiesSeeder } from './domains/recreational-facilities.seeder';
import { RecreationalBookingsSeeder } from './domains/recreational-bookings.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private recreationalFacilitiesSeeder: RecreationalFacilitiesSeeder,
    private recreationalBookingsSeeder: RecreationalBookingsSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting seeding of Recreational module...');

    // Seed facilities first
    await this.recreationalFacilitiesSeeder.seed();
    console.log('✅ Recreational facilities seeded');

    // Then seed bookings
    await this.recreationalBookingsSeeder.seed();
    console.log('✅ Recreational bookings seeded');

    console.log('🎉 Recreational module seeding completed!');
  }
}
