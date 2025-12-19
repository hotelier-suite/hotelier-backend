import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { SpacesModule } from './spaces/spaces.module';
import { IncidentsModule } from './incidents/incidents.module';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    VehiclesModule,
    SpacesModule,
    IncidentsModule,
    SeedersModule,
  ],
})
export class ParkingServiceModule {}
