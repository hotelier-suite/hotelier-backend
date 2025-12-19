import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { InvoicesSeeder } from './domains/invoices.seeder';
import { PaymentsSeeder } from './domains/payments.seeder';
import { Invoice } from '../entities/invoice.entity';
import { InvoiceItem } from '../entities/invoice-item.entity';
import { Payment } from '../entities/payment.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice, InvoiceItem, Payment, Reservation]),
  ],
  providers: [SeedersService, InvoicesSeeder, PaymentsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
