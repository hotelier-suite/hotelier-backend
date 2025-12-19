import { Injectable } from '@nestjs/common';
import { GuestsSeeder } from './domains/guests.seeder';
import { ReservationsSeeder } from './domains/reservations.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private guestsSeeder: GuestsSeeder,
    private reservationsSeeder: ReservationsSeeder,
  ) {}

  async seed() {
    // Order matters: guests first, then reservations
    await this.guestsSeeder.seed();
    await this.reservationsSeeder.seed();
  }
}
