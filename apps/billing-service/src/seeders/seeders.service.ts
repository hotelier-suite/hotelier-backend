import { Injectable } from '@nestjs/common';
import { InvoicesSeeder, PaymentsSeeder } from './domains';

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
