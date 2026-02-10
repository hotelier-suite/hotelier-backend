import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { ReportsModule } from './reports';
import { AnalyticsModule } from './analytics';
import { SeedersModule } from './seeders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    ReportsModule,
    AnalyticsModule,
    SeedersModule,
  ],
})
export class ReportsServiceModule {}
