import { Injectable } from '@nestjs/common';
import { EventsSeeder } from './domains/events.seeder';
import { EventBookingsSeeder } from './domains/event-bookings.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private eventsSeeder: EventsSeeder,
    private eventBookingsSeeder: EventBookingsSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting Events module seeding...');

    await this.eventsSeeder.seed();
    console.log('✅ Events seeded');

    await this.eventBookingsSeeder.seed();
    console.log('✅ Event bookings seeded');

    console.log('🎉 Events module seeding completed!');
  }
}
