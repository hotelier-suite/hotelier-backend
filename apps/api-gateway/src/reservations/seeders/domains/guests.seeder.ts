import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../../entities/guest.entity';

@Injectable()
export class GuestsSeeder {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  async seed() {
    const guests = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-123-4567',
        document: 'ABC123456',
        address: '123 Main St, New York, NY',
        nationality: 'American',
        vip: false,
      },
      {
        name: 'Mary Williams',
        email: 'maria.garcia@example.com',
        phone: '+1-555-234-5678',
        document: 'XYZ789012',
        address: '456 Oak Ave, Los Angeles, CA',
        nationality: 'American',
        vip: true,
      },
      {
        name: 'David Johnson',
        email: 'david.johnson@example.com',
        phone: '+1-555-345-6789',
        document: 'DEF456789',
        address: '789 Pine Rd, Chicago, IL',
        nationality: 'American',
        vip: false,
      },
      {
        name: 'Robert Williams',
        email: 'robert.williams@email.com',
        phone: '+1-555-456-7890',
        document: 'GHI123456',
        address: '321 Elm St, Houston, TX',
        nationality: 'American',
        vip: false,
      },
      {
        name: 'Jennifer Brown',
        email: 'jennifer.brown@email.com',
        phone: '+1-555-567-8901',
        document: 'JKL789012',
        address: '654 Maple Ave, Phoenix, AZ',
        nationality: 'American',
        vip: true,
      },
      {
        name: 'Michael Davis',
        email: 'michael.davis@email.com',
        phone: '+1-555-678-9012',
        document: 'MNO345678',
        address: '987 Cedar Blvd, Philadelphia, PA',
        nationality: 'American',
        vip: false,
      },
      {
        name: 'Sarah Miller',
        email: 'sarah.miller@email.com',
        phone: '+1-555-789-0123',
        document: 'PQR901234',
        address: '147 Birch Lane, San Antonio, TX',
        nationality: 'American',
        vip: false,
      },
      {
        name: 'Christopher Wilson',
        email: 'chris.wilson@email.com',
        phone: '+1-555-890-1234',
        document: 'STU567890',
        address: '258 Spruce Dr, San Diego, CA',
        nationality: 'American',
        vip: true,
      },
      {
        name: 'Amanda Taylor',
        email: 'amanda.taylor@email.com',
        phone: '+1-555-901-2345',
        document: 'VWX123789',
        address: '369 Willow Way, Dallas, TX',
        nationality: 'American',
        vip: false,
      },
      {
        name: 'Daniel Anderson',
        email: 'daniel.anderson@email.com',
        phone: '+1-555-012-3456',
        document: 'YZA456012',
        address: '741 Redwood Ct, San Jose, CA',
        nationality: 'American',
        vip: false,
      },
    ];

    for (const guestData of guests) {
      const existingGuest = await this.guestRepository.findOne({
        where: { email: guestData.email },
      });

      if (!existingGuest) {
        await this.guestRepository.save(guestData);
      }
    }
  }
}
