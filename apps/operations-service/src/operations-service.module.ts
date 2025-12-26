import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { HousekeepingModule } from './housekeeping';
import { MaintenanceModule } from './maintenance';
import { SeedersModule } from './seeders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    HousekeepingModule,
    MaintenanceModule,
    SeedersModule,
  ],
})
export class OperationsServiceModule {}
