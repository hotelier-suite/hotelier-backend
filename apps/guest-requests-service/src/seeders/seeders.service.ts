import { Injectable } from '@nestjs/common';
import { GuestRequestsSeeder } from '../guest-requests';

@Injectable()
export class SeedersService {
  constructor(private guestRequestsSeeder: GuestRequestsSeeder) {}

  async seed() {
    await this.guestRequestsSeeder.seed();
  }
}
