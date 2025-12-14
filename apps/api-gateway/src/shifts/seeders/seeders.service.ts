import { Injectable } from '@nestjs/common';
import { ShiftsSeeder } from './domains/shifts.seeder';

@Injectable()
export class SeedersService {
  constructor(private shiftsSeeder: ShiftsSeeder) {}

  async seed() {
    await this.shiftsSeeder.seed();
  }
}
