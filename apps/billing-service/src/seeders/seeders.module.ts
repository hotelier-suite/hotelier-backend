import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { InvoicesSeeder } from './domains/invoices.seeder';
import { PaymentsSeeder } from './domains/payments.seeder';
import { Invoice } from '../billing/entities/invoice.entity';
import { InvoiceItem } from '../billing/entities/invoice-item.entity';
import { Payment } from '../billing/entities/payment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem, Payment])],
  providers: [SeedersService, InvoicesSeeder, PaymentsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
