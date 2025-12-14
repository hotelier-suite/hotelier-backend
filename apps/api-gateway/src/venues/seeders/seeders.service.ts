import { Injectable } from '@nestjs/common';
import { VenuesSeeder } from './domains/venues.seeder';

@Injectable()
export class SeedersService {
  constructor(private venuesSeeder: VenuesSeeder) {}

  async seed() {
    await this.venuesSeeder.seed();
  }
}
