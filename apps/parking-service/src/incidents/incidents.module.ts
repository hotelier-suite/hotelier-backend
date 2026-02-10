import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingIncident } from './entities';
import { IncidentsController } from './incidents.controller';
import { IncidentsService } from './incidents.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingIncident])],
  controllers: [IncidentsController],
  providers: [IncidentsService],
})
export class IncidentsModule {}
