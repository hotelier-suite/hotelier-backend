import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from '../../entities/invoice.entity';
import { InvoiceItem } from '../../entities/invoice-item.entity';
import { Reservation } from '../../../reservations/entities/reservation.entity';
import { InvoiceStatus } from '../../enums/invoice-status.enum';
import { PaymentMethod } from '../../enums/payment-method.enum';

@Injectable()
export class InvoicesSeeder {
  constructor(
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
    @InjectRepository(InvoiceItem)
    private invoiceItemRepository: Repository<InvoiceItem>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  async seed() {
    const existingInvoicesCount = await this.invoiceRepository.count();

    if (existingInvoicesCount > 0) {
      console.log('⏭️ Invoices already exist, skipping seeding');
      return;
    }

    const reservations = await this.reservationRepository.find();
    const users = [{ id: 1 }, { id: 2 }];

    if (reservations.length === 0) {
      console.log('Skipping invoice seeds - no reservations found');
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
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    const threeMonthsAgo = new Date(now);
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    // Helper function to create a date
    const createDate = (year: number, month: number, day: number) => {
      return new Date(year, month - 1, day);
    };

    const invoices = [
      // Recent invoices
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
        reservationId: reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Deluxe Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
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
        reservationId: reservations[1]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Standard Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
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
        reservationId: reservations[2]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Family Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Restaurant Services',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
        ],
      },
      {
        number: 'INV-2025-0004',
        guestName: 'Sophie Reynolds',
        issueDate: twoWeeksAgo,
        dueDate: new Date(twoWeeksAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 75.0,
        taxes: 7.5,
        total: 82.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[3]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Standard Room (1 night)',
            quantity: 1,
            price: 75.0,
            total: 75.0,
          },
        ],
      },

      // One month ago invoices
      {
        number: 'INV-2024-0101',
        guestName: 'Andrew Castle',
        issueDate: oneMonthAgo,
        dueDate: new Date(oneMonthAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 950.0,
        taxes: 95.0,
        total: 1045.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[4]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Executive Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Restaurant Services',
            quantity: 1,
            price: 125.0,
            total: 125.0,
          },
          {
            description: 'Laundry and other services',
            quantity: 1,
            price: 75.0,
            total: 75.0,
          },
        ],
      },
      {
        number: 'INV-2024-0102',
        guestName: 'Patricia Miller',
        issueDate: oneMonthAgo,
        dueDate: new Date(oneMonthAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 300.0,
        taxes: 30.0,
        total: 330.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[5]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Deluxe Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
          {
            description: 'Restaurant Services',
            quantity: 1,
            price: 75.0,
            total: 75.0,
          },
        ],
      },
      {
        number: 'INV-2024-0103',
        guestName: 'Richard Turner',
        issueDate: oneMonthAgo,
        dueDate: new Date(oneMonthAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[6]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Standard Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
        ],
      },

      // Two months ago invoices
      {
        number: 'INV-2024-0081',
        guestName: 'Valentine Rivers',
        issueDate: twoMonthsAgo,
        dueDate: new Date(twoMonthsAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 1250.0,
        taxes: 125.0,
        total: 1375.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[7]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Family Suite (6 nights)',
            quantity: 6,
            price: 150.0,
            total: 900.0,
          },
          {
            description: 'Restaurant Services',
            quantity: 1,
            price: 200.0,
            total: 200.0,
          },
          {
            description: 'Spa and additional services',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
        ],
      },
      {
        number: 'INV-2024-0082',
        guestName: 'Michael Andrews',
        issueDate: twoMonthsAgo,
        dueDate: new Date(twoMonthsAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[8]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Executive Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },
      {
        number: 'INV-2024-0083',
        guestName: 'Laura Miller',
        issueDate: twoMonthsAgo,
        dueDate: new Date(twoMonthsAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 200.0,
        taxes: 20.0,
        total: 220.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[9]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Deluxe Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
          {
            description: 'Restaurant Services',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },

      // Three months ago invoices
      {
        number: 'INV-2024-0061',
        guestName: 'George Henderson',
        issueDate: threeMonthsAgo,
        dueDate: new Date(threeMonthsAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 800.0,
        taxes: 80.0,
        total: 880.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[10]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Family Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Restaurant Services',
            quantity: 1,
            price: 125.0,
            total: 125.0,
          },
          {
            description: 'Additional services',
            quantity: 1,
            price: 75.0,
            total: 75.0,
          },
        ],
      },
      {
        number: 'INV-2024-0062',
        guestName: 'Catherine Oliver',
        issueDate: threeMonthsAgo,
        dueDate: new Date(threeMonthsAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 650.0,
        taxes: 65.0,
        total: 715.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[11]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Honeymoon Suite (5 nights)',
            quantity: 5,
            price: 75.0,
            total: 375.0,
          },
          {
            description: 'Romantic package',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
          {
            description: 'Restaurant Services',
            quantity: 1,
            price: 125.0,
            total: 125.0,
          },
          {
            description: 'Couples spa',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2024-0063',
        guestName: 'Steven Rice',
        issueDate: threeMonthsAgo,
        dueDate: new Date(threeMonthsAgo.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 75.0,
        taxes: 7.5,
        total: 82.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[12]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Standard Room (1 night)',
            quantity: 1,
            price: 75.0,
            total: 75.0,
          },
        ],
      },

      // Some pending invoices
      {
        number: 'INV-2025-0005',
        guestName: 'Anna Wilson',
        issueDate: now,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PENDING,
        currency: 'USD',
        reservationId: reservations[13]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Standard Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
        ],
      },
      {
        number: 'INV-2025-0006',
        guestName: 'Peter Smith',
        issueDate: now,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        subtotal: 500.0,
        taxes: 50.0,
        total: 550.0,
        status: InvoiceStatus.PENDING,
        currency: 'USD',
        reservationId: reservations[14]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Premium Suite (3 nights)',
            quantity: 3,
            price: 150.0,
            total: 450.0,
          },
          {
            description: 'Restaurant Services',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },

      // Overdue invoice
      {
        number: 'INV-2024-0104',
        guestName: 'Delinquent Client',
        issueDate: oneMonthAgo,
        dueDate: new Date(oneMonthAgo.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 days (overdue)
        subtotal: 375.0,
        taxes: 37.5,
        total: 412.5,
        status: InvoiceStatus.OVERDUE,
        currency: 'USD',
        reservationId: reservations[15]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Deluxe Room (5 nights)',
            quantity: 5,
            price: 75.0,
            total: 375.0,
          },
        ],
      },

      // === 2025 Historical Invoices (January to current month) ===
      // January 2025
      {
        number: 'INV-2025-01-001',
        guestName: 'Danielle Owen',
        issueDate: createDate(2025, 1, 11),
        dueDate: createDate(2025, 2, 10),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },
      {
        number: 'INV-2025-01-002',
        guestName: 'Edward Sanders',
        issueDate: createDate(2025, 1, 25),
        dueDate: createDate(2025, 2, 24),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[1]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // February 2025
      {
        number: 'INV-2025-02-001',
        guestName: 'Faith Clark',
        issueDate: createDate(2025, 2, 15),
        dueDate: createDate(2025, 3, 17),
        subtotal: 275.0,
        taxes: 27.5,
        total: 302.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[2]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
          {
            description: 'Romantic dinner',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2025-02-002',
        guestName: 'Gary Roberts',
        issueDate: createDate(2025, 2, 26),
        dueDate: createDate(2025, 3, 28),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[3]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
        ],
      },

      // March 2025
      {
        number: 'INV-2025-03-001',
        guestName: 'Helena Vincent',
        issueDate: createDate(2025, 3, 14),
        dueDate: createDate(2025, 4, 13),
        subtotal: 700.0,
        taxes: 70.0,
        total: 770.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[4]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
        ],
      },
      {
        number: 'INV-2025-03-002',
        guestName: 'Isaac Bradley',
        issueDate: createDate(2025, 3, 28),
        dueDate: createDate(2025, 4, 27),
        subtotal: 450.0,
        taxes: 45.0,
        total: 495.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[5]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (3 nights)',
            quantity: 3,
            price: 150.0,
            total: 450.0,
          },
        ],
      },

      // April 2025
      {
        number: 'INV-2025-04-001',
        guestName: 'Julia Sanders',
        issueDate: createDate(2025, 4, 12),
        dueDate: createDate(2025, 5, 12),
        subtotal: 300.0,
        taxes: 30.0,
        total: 330.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[6]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
        ],
      },
      {
        number: 'INV-2025-04-002',
        guestName: 'Kevin Moore',
        issueDate: createDate(2025, 4, 25),
        dueDate: createDate(2025, 5, 25),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[7]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // May 2025
      {
        number: 'INV-2025-05-001',
        guestName: 'Lauren Fisher',
        issueDate: createDate(2025, 5, 15),
        dueDate: createDate(2025, 6, 14),
        subtotal: 950.0,
        taxes: 95.0,
        total: 1045.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[8]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Executive Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 125.0,
            total: 125.0,
          },
          {
            description: 'Spa',
            quantity: 1,
            price: 75.0,
            total: 75.0,
          },
        ],
      },
      {
        number: 'INV-2025-05-002',
        guestName: 'Matthew Carter',
        issueDate: createDate(2025, 5, 28),
        dueDate: createDate(2025, 6, 27),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[9]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
        ],
      },

      // June 2025
      {
        number: 'INV-2025-06-001',
        guestName: 'Natalie Davis',
        issueDate: createDate(2025, 6, 13),
        dueDate: createDate(2025, 7, 13),
        subtotal: 750.0,
        taxes: 75.0,
        total: 825.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[10]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
        ],
      },
      {
        number: 'INV-2025-06-002',
        guestName: 'Oscar Williams',
        issueDate: createDate(2025, 6, 28),
        dueDate: createDate(2025, 7, 28),
        subtotal: 600.0,
        taxes: 60.0,
        total: 660.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[11]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
        ],
      },

      // July 2025
      {
        number: 'INV-2025-07-001',
        guestName: 'Paula Bennett',
        issueDate: createDate(2025, 7, 13),
        dueDate: createDate(2025, 8, 12),
        subtotal: 1000.0,
        taxes: 100.0,
        total: 1100.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[12]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Family Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 200.0,
            total: 200.0,
          },
          {
            description: 'Tours',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2025-07-002',
        guestName: 'Quincy Adams',
        issueDate: createDate(2025, 7, 26),
        dueDate: createDate(2025, 8, 25),
        subtotal: 400.0,
        taxes: 40.0,
        total: 440.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[13]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
        ],
      },

      // August 2025
      {
        number: 'INV-2025-08-001',
        guestName: 'Rose Malone',
        issueDate: createDate(2025, 8, 10),
        dueDate: createDate(2025, 9, 9),
        subtotal: 950.0,
        taxes: 95.0,
        total: 1045.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[14]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
          {
            description: 'Spa',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2025-08-002',
        guestName: 'Scott Lewis',
        issueDate: createDate(2025, 8, 27),
        dueDate: createDate(2025, 9, 26),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[15]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // September 2025
      {
        number: 'INV-2025-09-001',
        guestName: 'Teresa Palmer',
        issueDate: createDate(2025, 9, 13),
        dueDate: createDate(2025, 10, 13),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[16]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },
      {
        number: 'INV-2025-09-002',
        guestName: 'Ulysses Carter',
        issueDate: createDate(2025, 9, 29),
        dueDate: createDate(2025, 10, 29),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[17]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // October 2025 (current month)
      {
        number: 'INV-2025-10-001',
        guestName: 'Veronica Stone',
        issueDate: createDate(2025, 10, 9),
        dueDate: createDate(2025, 11, 8),
        subtotal: 400.0,
        taxes: 40.0,
        total: 440.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[18]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
        ],
      },

      // === 2024 Historical Invoices (all months) ===
      // January 2024
      {
        number: 'INV-2024-01-001',
        guestName: 'Charles Miller',
        issueDate: createDate(2024, 1, 8),
        dueDate: createDate(2024, 2, 7),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },
      {
        number: 'INV-2024-01-002',
        guestName: 'Anna Bolton',
        issueDate: createDate(2024, 1, 18),
        dueDate: createDate(2024, 2, 17),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[1]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // February 2024
      {
        number: 'INV-2024-02-001',
        guestName: 'Mary Anderson',
        issueDate: createDate(2024, 2, 14),
        dueDate: createDate(2024, 3, 15),
        subtotal: 750.0,
        taxes: 75.0,
        total: 825.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[2]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Romantic dinner',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
        ],
      },
      {
        number: 'INV-2024-02-002',
        guestName: 'Joseph Reynolds',
        issueDate: createDate(2024, 2, 22),
        dueDate: createDate(2024, 3, 23),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[3]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
        ],
      },

      // March 2024
      {
        number: 'INV-2024-03-001',
        guestName: 'Sandra Peters',
        issueDate: createDate(2024, 3, 12),
        dueDate: createDate(2024, 4, 11),
        subtotal: 700.0,
        taxes: 70.0,
        total: 770.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[4]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Family Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
        ],
      },
      {
        number: 'INV-2024-03-002',
        guestName: 'Louis Adams',
        issueDate: createDate(2024, 3, 25),
        dueDate: createDate(2024, 4, 24),
        subtotal: 450.0,
        taxes: 45.0,
        total: 495.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[5]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (3 nights)',
            quantity: 3,
            price: 150.0,
            total: 450.0,
          },
        ],
      },

      // April 2024
      {
        number: 'INV-2024-04-001',
        guestName: 'Diana Sullivan',
        issueDate: createDate(2024, 4, 9),
        dueDate: createDate(2024, 5, 9),
        subtotal: 300.0,
        taxes: 30.0,
        total: 330.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[6]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
        ],
      },
      {
        number: 'INV-2024-04-002',
        guestName: 'Henry Murray',
        issueDate: createDate(2024, 4, 21),
        dueDate: createDate(2024, 5, 21),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[7]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // May 2024
      {
        number: 'INV-2024-05-001',
        guestName: 'Paula Curtis',
        issueDate: createDate(2024, 5, 15),
        dueDate: createDate(2024, 6, 14),
        subtotal: 950.0,
        taxes: 95.0,
        total: 1045.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[8]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Executive Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 125.0,
            total: 125.0,
          },
          { description: 'Spa', quantity: 1, price: 75.0, total: 75.0 },
        ],
      },
      {
        number: 'INV-2024-05-002',
        guestName: 'Gerald Stone',
        issueDate: createDate(2024, 5, 26),
        dueDate: createDate(2024, 6, 25),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[9]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
        ],
      },

      // June 2024
      {
        number: 'INV-2024-06-001',
        guestName: 'Claudia Rhodes',
        issueDate: createDate(2024, 6, 11),
        dueDate: createDate(2024, 7, 11),
        subtotal: 800.0,
        taxes: 80.0,
        total: 880.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[10]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
          {
            description: 'Tours',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2024-06-002',
        guestName: 'Albert Vincent',
        issueDate: createDate(2024, 6, 24),
        dueDate: createDate(2024, 7, 24),
        subtotal: 600.0,
        taxes: 60.0,
        total: 660.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[11]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
        ],
      },

      // July 2024
      {
        number: 'INV-2024-07-001',
        guestName: 'Beatrice Lewis',
        issueDate: createDate(2024, 7, 10),
        dueDate: createDate(2024, 8, 9),
        subtotal: 1150.0,
        taxes: 115.0,
        total: 1265.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[12]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Family Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 250.0,
            total: 250.0,
          },
          {
            description: 'Activities',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
        ],
      },
      {
        number: 'INV-2024-07-002',
        guestName: 'Philip Nash',
        issueDate: createDate(2024, 7, 22),
        dueDate: createDate(2024, 8, 21),
        subtotal: 400.0,
        taxes: 40.0,
        total: 440.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[13]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
        ],
      },

      // August 2024
      {
        number: 'INV-2024-08-001',
        guestName: 'Gloria Mason',
        issueDate: createDate(2024, 8, 7),
        dueDate: createDate(2024, 9, 6),
        subtotal: 950.0,
        taxes: 95.0,
        total: 1045.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[14]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
          { description: 'Spa', quantity: 1, price: 50.0, total: 50.0 },
        ],
      },
      {
        number: 'INV-2024-08-002',
        guestName: 'Ivan Parker',
        issueDate: createDate(2024, 8, 23),
        dueDate: createDate(2024, 9, 22),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[15]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // September 2024
      {
        number: 'INV-2024-09-001',
        guestName: 'Julia Cross',
        issueDate: createDate(2024, 9, 9),
        dueDate: createDate(2024, 10, 9),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[16]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },
      {
        number: 'INV-2024-09-002',
        guestName: 'Maurice Rivers',
        issueDate: createDate(2024, 9, 25),
        dueDate: createDate(2024, 10, 25),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[17]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // October 2024
      {
        number: 'INV-2024-10-001',
        guestName: 'Nora Clark',
        issueDate: createDate(2024, 10, 14),
        dueDate: createDate(2024, 11, 13),
        subtotal: 400.0,
        taxes: 40.0,
        total: 440.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[18]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
        ],
      },
      {
        number: 'INV-2024-10-002',
        guestName: 'Oscar Foster',
        issueDate: createDate(2024, 10, 28),
        dueDate: createDate(2024, 11, 27),
        subtotal: 500.0,
        taxes: 50.0,
        total: 550.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[19]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (3 nights)',
            quantity: 3,
            price: 150.0,
            total: 450.0,
          },
          {
            description: 'Halloween Decoration',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },

      // November 2024
      {
        number: 'INV-2024-11-001',
        guestName: 'Patricia Dunn',
        issueDate: createDate(2024, 11, 12),
        dueDate: createDate(2024, 12, 12),
        subtotal: 600.0,
        taxes: 60.0,
        total: 660.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[20]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
        ],
      },
      {
        number: 'INV-2024-11-002',
        guestName: 'Roderick Penn',
        issueDate: createDate(2024, 11, 25),
        dueDate: createDate(2024, 12, 25),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[21]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // December 2024
      {
        number: 'INV-2024-12-001',
        guestName: 'Sylvia Mason',
        issueDate: createDate(2024, 12, 20),
        dueDate: createDate(2025, 1, 19),
        subtotal: 1000.0,
        taxes: 100.0,
        total: 1100.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[22]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Family Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Christmas Dinner',
            quantity: 1,
            price: 200.0,
            total: 200.0,
          },
          {
            description: 'Decoration',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2024-12-002',
        guestName: 'Thomas Owen',
        issueDate: createDate(2024, 12, 31),
        dueDate: createDate(2025, 1, 30),
        subtotal: 500.0,
        taxes: 50.0,
        total: 550.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[23]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (3 nights)',
            quantity: 3,
            price: 150.0,
            total: 450.0,
          },
          {
            description: "New Year's Party",
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },

      // === 2023 Historical Invoices (all months) ===
      // January 2023
      {
        number: 'INV-2023-01-001',
        guestName: 'Amanda Carter',
        issueDate: createDate(2023, 1, 10),
        dueDate: createDate(2023, 2, 9),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },
      {
        number: 'INV-2023-01-002',
        guestName: 'Brian Taylor',
        issueDate: createDate(2023, 1, 23),
        dueDate: createDate(2023, 2, 22),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[1]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // February 2023
      {
        number: 'INV-2023-02-001',
        guestName: 'Caroline Flowers',
        issueDate: createDate(2023, 2, 15),
        dueDate: createDate(2023, 3, 17),
        subtotal: 275.0,
        taxes: 27.5,
        total: 302.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[2]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
          {
            description: 'Romantic dinner',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2023-02-002',
        guestName: 'David Montgomery',
        issueDate: createDate(2023, 2, 27),
        dueDate: createDate(2023, 3, 29),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[3]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
        ],
      },

      // March 2023
      {
        number: 'INV-2023-03-001',
        guestName: 'Ellen Sanders',
        issueDate: createDate(2023, 3, 14),
        dueDate: createDate(2023, 4, 13),
        subtotal: 700.0,
        taxes: 70.0,
        total: 770.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[4]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 100.0,
            total: 100.0,
          },
        ],
      },
      {
        number: 'INV-2023-03-002',
        guestName: 'Francis Lynn',
        issueDate: createDate(2023, 3, 27),
        dueDate: createDate(2023, 4, 26),
        subtotal: 450.0,
        taxes: 45.0,
        total: 495.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[5]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (3 nights)',
            quantity: 3,
            price: 150.0,
            total: 450.0,
          },
        ],
      },

      // April 2023
      {
        number: 'INV-2023-04-001',
        guestName: 'Gabrielle Stevens',
        issueDate: createDate(2023, 4, 12),
        dueDate: createDate(2023, 5, 12),
        subtotal: 300.0,
        taxes: 30.0,
        total: 330.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[6]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
        ],
      },
      {
        number: 'INV-2023-04-002',
        guestName: 'Hugh Green',
        issueDate: createDate(2023, 4, 25),
        dueDate: createDate(2023, 5, 25),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[7]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // May 2023
      {
        number: 'INV-2023-05-001',
        guestName: 'Irene Price',
        issueDate: createDate(2023, 5, 17),
        dueDate: createDate(2023, 6, 16),
        subtotal: 750.0,
        taxes: 75.0,
        total: 825.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[8]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
        ],
      },
      {
        number: 'INV-2023-05-002',
        guestName: 'Jason Parker',
        issueDate: createDate(2023, 5, 28),
        dueDate: createDate(2023, 6, 27),
        subtotal: 150.0,
        taxes: 15.0,
        total: 165.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[9]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (2 nights)',
            quantity: 2,
            price: 75.0,
            total: 150.0,
          },
        ],
      },

      // June 2023
      {
        number: 'INV-2023-06-001',
        guestName: 'Karen Black',
        issueDate: createDate(2023, 6, 13),
        dueDate: createDate(2023, 7, 13),
        subtotal: 750.0,
        taxes: 75.0,
        total: 825.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[10]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
        ],
      },
      {
        number: 'INV-2023-06-002',
        guestName: 'Leonard Kane',
        issueDate: createDate(2023, 6, 27),
        dueDate: createDate(2023, 7, 27),
        subtotal: 600.0,
        taxes: 60.0,
        total: 660.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[11]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
        ],
      },

      // July 2023
      {
        number: 'INV-2023-07-001',
        guestName: 'Mary Roberts',
        issueDate: createDate(2023, 7, 12),
        dueDate: createDate(2023, 8, 11),
        subtotal: 1000.0,
        taxes: 100.0,
        total: 1100.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[12]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Family Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Restaurant',
            quantity: 1,
            price: 200.0,
            total: 200.0,
          },
          {
            description: 'Tours',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2023-07-002',
        guestName: 'Nicholas Adams',
        issueDate: createDate(2023, 7, 24),
        dueDate: createDate(2023, 8, 23),
        subtotal: 300.0,
        taxes: 30.0,
        total: 330.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[13]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
        ],
      },

      // August 2023
      {
        number: 'INV-2023-08-001',
        guestName: 'Olga Sherman',
        issueDate: createDate(2023, 8, 9),
        dueDate: createDate(2023, 9, 8),
        subtotal: 750.0,
        taxes: 75.0,
        total: 825.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[14]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
        ],
      },
      {
        number: 'INV-2023-08-002',
        guestName: 'Paul Richardson',
        issueDate: createDate(2023, 8, 25),
        dueDate: createDate(2023, 9, 24),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[15]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // September 2023
      {
        number: 'INV-2023-09-001',
        guestName: 'Quinn Morris',
        issueDate: createDate(2023, 9, 11),
        dueDate: createDate(2023, 10, 11),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[16]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },
      {
        number: 'INV-2023-09-002',
        guestName: 'Raymond Wallace',
        issueDate: createDate(2023, 9, 27),
        dueDate: createDate(2023, 10, 27),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[17]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // October 2023
      {
        number: 'INV-2023-10-001',
        guestName: 'Sara Edwards',
        issueDate: createDate(2023, 10, 16),
        dueDate: createDate(2023, 11, 15),
        subtotal: 300.0,
        taxes: 30.0,
        total: 330.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[18]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Room (4 nights)',
            quantity: 4,
            price: 75.0,
            total: 300.0,
          },
        ],
      },
      {
        number: 'INV-2023-10-002',
        guestName: 'Thaddeus Irving',
        issueDate: createDate(2023, 10, 30),
        dueDate: createDate(2023, 11, 29),
        subtotal: 450.0,
        taxes: 45.0,
        total: 495.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[19]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Suite (3 nights)',
            quantity: 3,
            price: 150.0,
            total: 450.0,
          },
        ],
      },

      // November 2023
      {
        number: 'INV-2023-11-001',
        guestName: 'Ursula Brady',
        issueDate: createDate(2023, 11, 14),
        dueDate: createDate(2023, 12, 14),
        subtotal: 600.0,
        taxes: 60.0,
        total: 660.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[20]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Suite (4 nights)',
            quantity: 4,
            price: 150.0,
            total: 600.0,
          },
        ],
      },
      {
        number: 'INV-2023-11-002',
        guestName: 'Victor Peters',
        issueDate: createDate(2023, 11, 27),
        dueDate: createDate(2023, 12, 27),
        subtotal: 225.0,
        taxes: 22.5,
        total: 247.5,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.DEBIT_CARD,
        currency: 'USD',
        reservationId: reservations[21]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (3 nights)',
            quantity: 3,
            price: 75.0,
            total: 225.0,
          },
        ],
      },

      // December 2023
      {
        number: 'INV-2023-12-001',
        guestName: 'Wendy Allen',
        issueDate: createDate(2023, 12, 21),
        dueDate: createDate(2024, 1, 20),
        subtotal: 950.0,
        taxes: 95.0,
        total: 1045.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CREDIT_CARD,
        currency: 'USD',
        reservationId: reservations[22]?.id || reservations[0]?.id,
        userId: users[0]?.id,
        items: [
          {
            description: 'Family Suite (5 nights)',
            quantity: 5,
            price: 150.0,
            total: 750.0,
          },
          {
            description: 'Christmas Dinner',
            quantity: 1,
            price: 150.0,
            total: 150.0,
          },
          {
            description: 'Decoration',
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
      {
        number: 'INV-2023-12-002',
        guestName: 'Xavier Zimmerman',
        issueDate: createDate(2023, 12, 31),
        dueDate: createDate(2024, 1, 30),
        subtotal: 350.0,
        taxes: 35.0,
        total: 385.0,
        status: InvoiceStatus.PAID,
        paymentMethod: PaymentMethod.CASH,
        currency: 'USD',
        reservationId: reservations[23]?.id || reservations[0]?.id,
        userId: users[1]?.id,
        items: [
          {
            description: 'Room (2 nights)',
            quantity: 2,
            price: 150.0,
            total: 300.0,
          },
          {
            description: "New Year's Party",
            quantity: 1,
            price: 50.0,
            total: 50.0,
          },
        ],
      },
    ];

    for (const invoiceData of invoices) {
      const existingInvoice = await this.invoiceRepository.findOne({
        where: { number: invoiceData.number },
      });

      if (!existingInvoice) {
        const { items, ...invoiceInfo } = invoiceData;
        const invoice = await this.invoiceRepository.save(invoiceInfo);

        // Create invoice items
        for (const itemData of items) {
          await this.invoiceItemRepository.save({
            ...itemData,
            invoiceId: invoice.id,
          });
        }
      }
    }

    console.log(`✅ Seeded ${invoices.length} predefined invoices`);
  }
}
