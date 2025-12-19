import { Injectable } from '@nestjs/common';
import { GuestRequestsSeeder } from '../guest-requests/seeders/guest-requests.seeder';

@Injectable()
export class SeedersService {
  constructor(private guestRequestsSeeder: GuestRequestsSeeder) {}

  async seed() {
    await this.guestRequestsSeeder.seed();
  }
}
