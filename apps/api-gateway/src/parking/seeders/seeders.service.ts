import { Injectable } from '@nestjs/common';
import { ParkingSpacesSeeder } from './domains/parking-spaces.seeder';
import { VehiclesSeeder } from './domains/vehicles.seeder';
import { ParkingIncidentsSeeder } from './domains/parking-incidents.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private parkingSpacesSeeder: ParkingSpacesSeeder,
    private vehiclesSeeder: VehiclesSeeder,
    private parkingIncidentsSeeder: ParkingIncidentsSeeder,
  ) {}

  async seed() {
    // Order matters: spaces first, then vehicles, then incidents
    await this.parkingSpacesSeeder.seed();
    await this.vehiclesSeeder.seed();
    await this.parkingIncidentsSeeder.seed();
  }
}
