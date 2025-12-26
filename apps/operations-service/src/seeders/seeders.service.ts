import { Injectable } from '@nestjs/common';
import { HousekeepingSeeder } from '../housekeeping';
import { MaintenanceSeeder } from '../maintenance';

@Injectable()
export class SeedersService {
  constructor(
    private readonly housekeepingSeeder: HousekeepingSeeder,
    private readonly maintenanceSeeder: MaintenanceSeeder,
  ) {}

  async seed(): Promise<void> {
    await this.housekeepingSeeder.seed();
    await this.maintenanceSeeder.seed();
  }
}
