import { Injectable } from '@nestjs/common';
import { RoomsSeeder } from './domains/rooms.seeder';

@Injectable()
export class SeedersService {
  constructor(private roomsSeeder: RoomsSeeder) {}

  async seed() {
    await this.roomsSeeder.seed();
  }
}
