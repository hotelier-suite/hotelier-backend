import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { VehiclesModule } from './vehicles';
import { SpacesModule } from './spaces';
import { IncidentsModule } from './incidents';
import { SeedersModule } from './seeders';

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
