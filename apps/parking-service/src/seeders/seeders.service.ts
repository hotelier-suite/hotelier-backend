import { Injectable } from '@nestjs/common';
import { VehiclesSeeder } from '../vehicles';
import { ParkingSpacesSeeder } from '../spaces';
import { ParkingIncidentsSeeder } from '../incidents';

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
