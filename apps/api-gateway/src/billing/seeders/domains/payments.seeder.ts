import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from '../../entities/payment.entity';
import { Invoice } from '../../entities/invoice.entity';
import { PaymentMethod } from '../../enums/payment-method.enum';
import { PaymentStatus } from '../../enums/payment-status.enum';

@Injectable()
export class PaymentsSeeder {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async seed() {
    // Simple approach - create fixed payments
    const invoices = await this.invoiceRepository.find({ take: 5 });

    if (invoices.length === 0) {
      console.log('Skipping payment seeds - no invoices found');
      return;
    }

    const payments = [
      {
        reference: 'PAY-2024-0001',
        amount: 495.0,
        method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        notes: 'Payment processed successfully via credit card',
        processedAt: new Date(),
        invoiceId: invoices[0].id,
      },
      {
        reference: 'PAY-2024-0002',
        amount: 858.0,
        method: PaymentMethod.BANK_TRANSFER,
        status: PaymentStatus.COMPLETED,
        notes: 'Bank transfer payment completed',
        processedAt: new Date(),
        invoiceId: invoices[1]?.id || invoices[0].id,
      },
      {
        reference: 'PAY-2024-0003',
        amount: 374.0,
        method: PaymentMethod.CREDIT_CARD,
        status: PaymentStatus.COMPLETED,
        notes: 'Full payment received',
        processedAt: new Date(),
        invoiceId: invoices[2]?.id || invoices[0].id,
      },
      {
        reference: 'PAY-2024-0004',
        amount: 200.0,
        method: PaymentMethod.BANK_TRANSFER,
        status: PaymentStatus.PENDING,
        notes: 'Partial payment - transfer in process',
        processedAt: new Date(),
        invoiceId: invoices[3]?.id || invoices[0].id,
      },
      {
        reference: 'PAY-2024-0005',
        amount: 1012.0,
        method: PaymentMethod.DEBIT_CARD,
        status: PaymentStatus.COMPLETED,
        notes: 'Debit card payment processed',
        processedAt: new Date(),
        invoiceId: invoices[4]?.id || invoices[0].id,
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
  }
}
