import { Injectable } from '@nestjs/common';
import { GuestRequestsSeeder } from './domains/guest-requests.seeder';

@Injectable()
export class SeedersService {
  constructor(private guestRequestsSeeder: GuestRequestsSeeder) {}

  async seed() {
    console.log('🌱 Starting Guest Requests module seeding...');

    await this.guestRequestsSeeder.seed();
    console.log('✅ Guest requests seeded');

    console.log('🎉 Guest Requests module seeding completed!');
  }
}
