import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesSeeder } from './vehicles.seeder';
import { Vehicle } from '../entities/vehicle.entity';
import { ParkingSpace } from '../../spaces/entities/parking-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, ParkingSpace])],
  providers: [VehiclesSeeder],
  exports: [VehiclesSeeder],
})
export class VehiclesSeedersModule {}
