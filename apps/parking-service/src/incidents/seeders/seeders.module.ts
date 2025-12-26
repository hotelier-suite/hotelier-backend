import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingIncidentsSeeder } from './parking-incidents.seeder';
import { ParkingIncident } from '../entities';
import { Vehicle } from '../../vehicles';
import { ParkingSpace } from '../../spaces';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingIncident, Vehicle, ParkingSpace])],
  providers: [ParkingIncidentsSeeder],
  exports: [ParkingIncidentsSeeder],
})
export class IncidentsSeedersModule {}
