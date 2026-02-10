import { Injectable } from '@nestjs/common';
import { WidgetsSeeder } from './domains';

@Injectable()
export class SeedersService {
  constructor(private widgetsSeeder: WidgetsSeeder) {}

  async seed() {
    console.log('🌱 Starting Dashboard service seeding...');

    await this.widgetsSeeder.seed();

    console.log('🎉 Dashboard service seeding completed!');
  }
}
