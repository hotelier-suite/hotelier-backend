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
    console.log('🌱 Starting Billing module seeding...');

    // Order matters: invoices first, then payments
    await this.invoicesSeeder.seed();
    console.log('✅ Invoices seeded');

    await this.paymentsSeeder.seed();
    console.log('✅ Payments seeded');

    console.log('🎉 Billing module seeding completed!');
  }
}
