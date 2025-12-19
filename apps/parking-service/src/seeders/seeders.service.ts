import { Injectable } from '@nestjs/common';
import { VehiclesSeeder } from '../vehicles/seeders/vehicles.seeder';
import { ParkingSpacesSeeder } from '../spaces/seeders/parking-spaces.seeder';
import { ParkingIncidentsSeeder } from '../incidents/seeders/parking-incidents.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private parkingSpacesSeeder: ParkingSpacesSeeder,
    private vehiclesSeeder: VehiclesSeeder,
    private parkingIncidentsSeeder: ParkingIncidentsSeeder,
  ) {}

  async seed() {
    await this.parkingSpacesSeeder.seed();
    await this.vehiclesSeeder.seed();
    await this.parkingIncidentsSeeder.seed();
  }
}
