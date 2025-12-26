import { Injectable } from '@nestjs/common';
import { GuestsSeeder } from '../guests';
import { ReservationsSeeder } from '../reservations';
import { RoomsSeeder } from '../rooms';

@Injectable()
export class SeedersService {
  constructor(
    private readonly roomsSeeder: RoomsSeeder,
    private readonly guestsSeeder: GuestsSeeder,
    private readonly reservationsSeeder: ReservationsSeeder,
  ) {}

  async seed(): Promise<void> {
    await this.roomsSeeder.seed();
    await this.guestsSeeder.seed();
    await this.reservationsSeeder.seed();
  }
}
