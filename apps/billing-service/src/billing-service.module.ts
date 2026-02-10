import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database';
import { InvoicesModule } from './invoices';
import { PaymentsModule } from './payments';
import { StatisticsModule } from './statistics';
import { SeedersModule } from './seeders';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    InvoicesModule,
    PaymentsModule,
    StatisticsModule,
    SeedersModule,
  ],
})
export class BillingServiceModule {}
