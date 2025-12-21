import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from '../entities/guest.entity';

@Injectable()
export class GuestsSeeder {
  constructor(
    @InjectRepository(Guest)
    private readonly guestsRepository: Repository<Guest>,
  ) {}

  async seed(): Promise<void> {
    const guests: Array<
      Omit<Guest, 'id' | 'createdAt' | 'updatedAt' | 'reservations'>
    > = [
      {
        name: 'John Smith',
        email: 'john.smith@example.com',
        phone: '+1-555-123-4567',
        document: 'ABC123456',
        address: '123 Main St, New York, NY',
        nationality: 'American',
        preferences: 'Non-smoking room, high floor',
        vip: false,
      },
      {
        name: 'Mary Williams',
        email: 'mary.williams@example.com',
        phone: '+1-555-987-6543',
        document: 'XYZ987654',
        address: '456 Oak Ave, Los Angeles, CA',
        nationality: 'American',
        preferences: 'Extra pillows',
        vip: true,
      },
      {
        name: 'Carlos Rodriguez',
        email: 'carlos.rodriguez@example.com',
        phone: '+34-600-123-456',
        document: 'ESP1234567',
        address: 'Calle Mayor 10, Madrid',
        nationality: 'Spanish',
        preferences: 'Late check-in',
        vip: false,
      },
    ];

    for (const guestData of guests) {
      const existing = await this.guestsRepository.findOne({
        where: { email: guestData.email },
      });

      if (!existing) {
        await this.guestsRepository.save(guestData);
      }
    }
  }
}
