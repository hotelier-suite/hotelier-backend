import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../billing/entities/payment.entity';
import { Invoice } from '../../billing/entities/invoice.entity';
import { PaymentMethod } from '@app/contracts/billing-service/payments/enums/payment-method.enum';
import { PaymentStatus } from '@app/contracts/billing-service/payments/enums/payment-status.enum';

@Injectable()
export class PaymentsSeeder {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async seed() {
    const existingPaymentsCount = await this.paymentRepository.count();

    if (existingPaymentsCount > 0) {
      console.log('⏭️ Payments already exist, skipping seeding');
      return;
    }

    const invoices = await this.invoiceRepository.find({ take: 5 });

    if (invoices.length === 0) {
      console.log('⏭️ Skipping payment seeds - no invoices found');
      return;
    }

    console.log('💳 Creating predefined payments...');

    const payments = [
      {
        reference: 'PAY-2025-0001',
        amount: 247.5,
        method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        notes: 'Payment processed successfully via credit card',
        processedAt: new Date(),
        invoiceId: invoices[0].id,
      },
      {
        reference: 'PAY-2025-0002',
        amount: 165.0,
        method: PaymentMethod.DEBIT_CARD,
        status: PaymentStatus.COMPLETED,
        notes: 'Debit card payment completed',
        processedAt: new Date(),
        invoiceId: invoices[1]?.id || invoices[0].id,
      },
      {
        reference: 'PAY-2025-0003',
        amount: 770.0,
        method: PaymentMethod.CASH,
        status: PaymentStatus.COMPLETED,
        notes: 'Cash payment received',
        processedAt: new Date(),
        invoiceId: invoices[2]?.id || invoices[0].id,
      },
    ];

    for (const paymentData of payments) {
      const existingPayment = await this.paymentRepository.findOne({
        where: { reference: paymentData.reference },
      });

      if (!existingPayment) {
        await this.paymentRepository.save(paymentData);
      }
    }

    console.log(`✅ Created ${payments.length} payments`);
  }
}
