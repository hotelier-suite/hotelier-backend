import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../billing/entities/invoice.entity';
import { InvoiceItem } from '../../billing/entities/invoice-item.entity';
import { InvoiceStatus } from '@app/contracts/billing-service/invoices/enums/invoice-status.enum';
import { PaymentMethod } from '@app/contracts/billing-service/payments/enums/payment-method.enum';

@Injectable()
export class InvoicesSeeder {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
  ) {}

  async seed() {
    const existingInvoicesCount = await this.invoiceRepository.count();

    if (existingInvoicesCount > 0) {
      console.log('⏭️ Invoices already exist, skipping seeding');
      return;
    }

    console.log('📄 Creating predefined invoices...');

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const invoices = [
      {
        number: 'INV-2025-0001',
        guestName: 'David Taylor',
        issueDate: oneWeekAgo,
        dueDate: new Date(oneWeekAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: 1,
        userId: 1,
        items: [
          { description: 'Deluxe Room (3 nights)', quantity: 3, price: 75.0, total: 225.0 },
        ],
      },
      {
        number: 'INV-2025-0002',
        guestName: 'Caroline Parker',
        issueDate: oneWeekAgo,
        dueDate: new Date(oneWeekAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: 2,
        userId: 1,
        items: [
          { description: 'Standard Room (2 nights)', quantity: 2, price: 75.0, total: 150.0 },
        ],
      },
      {
        number: 'INV-2025-0003',
        guestName: 'Frank Williams',
        issueDate: twoWeeksAgo,
        dueDate: new Date(twoWeeksAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 700.0,
        taxes: 70.0,
        total: 770.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: 3,
        userId: 2,
        items: [
          { description: 'Family Suite (4 nights)', quantity: 4, price: 150.0, total: 600.0 },
          { description: 'Restaurant Services', quantity: 1, price: 100.0, total: 100.0 },
        ],
      },
      {
        number: 'INV-2025-0004',
        guestName: 'Anna Wilson',
        issueDate: now,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PENDING,
        currency: 'USD',
        reservationId: 4,
        userId: 1,
        items: [
          { description: 'Standard Room (2 nights)', quantity: 2, price: 75.0, total: 150.0 },
        ],
      },
      {
        number: 'INV-2025-0005',
        guestName: 'Peter Smith',
        issueDate: now,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 500.0,
        taxes: 50.0,
        total: 550.0,
        status: InvoiceStatus.PENDING,
        currency: 'USD',
        reservationId: 5,
        userId: 2,
        items: [
          { description: 'Premium Suite (3 nights)', quantity: 3, price: 150.0, total: 450.0 },
          { description: 'Restaurant Services', quantity: 1, price: 50.0, total: 50.0 },
        ],
      },
      {
        number: 'INV-2025-0006',
        guestName: 'Delinquent Client',
        issueDate: oneMonthAgo,
        dueDate: new Date(oneMonthAgo.getTime() + 15 * 24 * 60 * 60 * 1000),
        subtotal: 375.0,
        taxes: 37.5,
        total: 412.5,
        status: InvoiceStatus.OVERDUE,
        currency: 'USD',
        reservationId: 6,
        userId: 1,
        items: [
          { description: 'Deluxe Room (5 nights)', quantity: 5, price: 75.0, total: 375.0 },
        ],
      },
    ];

    for (const invoiceData of invoices) {
      const { items, ...invoiceFields } = invoiceData;
      const invoice = await this.invoiceRepository.save(invoiceFields);

      for (const item of items) {
        await this.invoiceItemRepository.save({
          ...item,
          invoiceId: invoice.id,
        });
      }
    }

    console.log(`✅ Created ${invoices.length} invoices with items`);
  }
}
