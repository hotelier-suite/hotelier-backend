import { Injectable } from '@nestjs/common';
import { GuestsSeeder } from '../guests/seeders/guests.seeder';
import { ReservationsSeeder } from '../reservations/seeders/reservations.seeder';
import { RoomsSeeder } from '../rooms/seeders/rooms.seeder';

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
