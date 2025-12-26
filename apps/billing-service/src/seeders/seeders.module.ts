import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { InvoicesSeeder, PaymentsSeeder } from './domains';
import { Invoice, InvoiceItem, Payment } from '../billing';

@Module({
  imports: [TypeOrmModule.forFeature([Invoice, InvoiceItem, Payment])],
  providers: [SeedersService, InvoicesSeeder, PaymentsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
