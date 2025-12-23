import { Injectable } from '@nestjs/common';
import { InvoicesSeeder } from './domains/invoices.seeder';
import { PaymentsSeeder } from './domains/payments.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private invoicesSeeder: InvoicesSeeder,
    private paymentsSeeder: PaymentsSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting Billing service seeding...');

    // Order matters: invoices first, then payments
    await this.invoicesSeeder.seed();
    await this.paymentsSeeder.seed();

    console.log('🎉 Billing service seeding completed!');
  }
}
