import { Injectable } from '@nestjs/common';
import { MaintenanceRequestSeeder } from './domains/maintenance-requests.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private readonly maintenanceRequestSeeder: MaintenanceRequestSeeder,
  ) {}

  async seed() {
    await this.maintenanceRequestSeeder.seed();
  }
}
