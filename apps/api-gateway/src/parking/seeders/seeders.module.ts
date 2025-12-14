import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { ParkingSpacesSeeder } from './domains/parking-spaces.seeder';
import { VehiclesSeeder } from './domains/vehicles.seeder';
import { ParkingIncidentsSeeder } from './domains/parking-incidents.seeder';
import { Vehicle } from '../entities/vehicle.entity';
import { ParkingSpace } from '../entities/parking-space.entity';
import { ParkingIncident } from '../entities/parking-incident.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, ParkingSpace, ParkingIncident])],
  providers: [
    SeedersService,
    ParkingSpacesSeeder,
    VehiclesSeeder,
    ParkingIncidentsSeeder,
  ],
  exports: [SeedersService],
})
export class SeedersModule {}
