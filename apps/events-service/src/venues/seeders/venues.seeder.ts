import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venue } from '../entities';

@Injectable()
export class VenuesSeeder {
  constructor(
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
  ) {}

  async seed() {
    const venues = [
      {
        name: 'Grand Ballroom',
        capacity: 200,
        area: 400.0,
        hourlyRate: 500.0,
        available: true,
        location: 'Main Building - Ground Floor',
        description:
          'Elegant ballroom perfect for weddings, corporate events and large celebrations. Features crystal chandeliers and panoramic city views.',
      },
      {
        name: 'Conference Room Alpha',
        capacity: 50,
        area: 80.0,
        hourlyRate: 150.0,
        available: true,
        location: 'Business Center - 2nd Floor',
        description:
          'Modern conference room equipped with the latest technology for business meetings and presentations.',
      },
      {
        name: 'Garden Pavilion',
        capacity: 120,
        area: 200.0,
        hourlyRate: 300.0,
        available: true,
        location: 'Hotel Gardens - Outdoor',
        description:
          'Beautiful outdoor pavilion surrounded by landscaped gardens, ideal for cocktail receptions and outdoor ceremonies.',
      },
      {
        name: 'Executive Suite',
        capacity: 20,
        area: 40.0,
        hourlyRate: 200.0,
        available: true,
        location: 'Executive Floor - 15th Floor',
        description:
          'Exclusive executive suite for high-level meetings with premium amenities and city skyline views.',
      },
      {
        name: 'Rooftop Terrace',
        capacity: 80,
        area: 150.0,
        hourlyRate: 400.0,
        available: false,
        location: 'Rooftop - 20th Floor',
        description:
          'Stunning rooftop venue with 360-degree city views, perfect for cocktail parties and exclusive events.',
      },
    ];

    for (const venueData of venues) {
      const existing = await this.venueRepository.findOne({
        where: { name: venueData.name },
      });

      if (!existing) {
        await this.venueRepository.save(venueData);
      }
    }
  }
}
