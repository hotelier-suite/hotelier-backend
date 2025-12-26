import { Injectable } from '@nestjs/common';
import { VenuesSeeder } from '../venues';
import { EventsSeeder, EventBookingsSeeder } from '../events';

@Injectable()
export class SeedersService {
  constructor(
    private readonly venuesSeeder: VenuesSeeder,
    private readonly eventsSeeder: EventsSeeder,
    private readonly eventBookingsSeeder: EventBookingsSeeder,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Starting Events Service seeding...');

    await this.venuesSeeder.seed();
    console.log('✅ Venues seeded');

    await this.eventsSeeder.seed();
    console.log('✅ Events seeded');

    await this.eventBookingsSeeder.seed();
    console.log('✅ Event bookings seeded');

    console.log('🎉 Events Service seeding completed!');
  }
}
