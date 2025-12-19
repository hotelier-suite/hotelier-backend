import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingIncidentsSeeder } from './parking-incidents.seeder';
import { ParkingIncident } from '../entities/parking-incident.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
import { ParkingSpace } from '../../spaces/entities/parking-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingIncident, Vehicle, ParkingSpace])],
  providers: [ParkingIncidentsSeeder],
  exports: [ParkingIncidentsSeeder],
})
export class IncidentsSeedersModule {}
