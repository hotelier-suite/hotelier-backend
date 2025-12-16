import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingSpacesSeeder } from './parking-spaces.seeder';
import { ParkingSpace } from '../entities/parking-space.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingSpace])],
  providers: [ParkingSpacesSeeder],
  exports: [ParkingSpacesSeeder],
})
export class SpacesSeedersModule {}
