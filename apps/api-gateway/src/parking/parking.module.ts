import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingController } from './parking.controller';
import { ParkingService } from './parking.service';
import { Vehicle } from './entities/vehicle.entity';
import { ParkingSpace } from './entities/parking-space.entity';
import { ParkingIncident } from './entities/parking-incident.entity';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, ParkingSpace, ParkingIncident]),
    SeedersModule,
  ],
  controllers: [ParkingController],
  providers: [ParkingService],
  exports: [ParkingService, SeedersModule],
})
export class ParkingModule {}
