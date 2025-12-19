import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { Invoice } from './entities/invoice.entity';
import { Payment } from './entities/payment.entity';
import { AuthModule } from '../auth-service/auth/auth.module';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, Payment]),
    AuthModule,
    SeedersModule,
  ],
  controllers: [BillingController],
  providers: [BillingService],
  exports: [BillingService, SeedersModule],
})
export class BillingModule {}
