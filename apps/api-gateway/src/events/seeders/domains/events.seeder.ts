import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../../entities/event.entity';
import { EventStatus } from '../../enums/event-status.enum';

@Injectable()
export class EventsSeeder {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async seed() {
    const events = [
      {
        title: 'Annual Corporate Retreat',
        description:
          'Corporate retreat focused on team building and strategic planning for the upcoming year.',
        eventDate: new Date('2024-12-15'),
        startTime: '09:00',
        endTime: '17:00',
        venue: 'Alpha Conference Room',
        capacity: 50,
        attendees: 45,
        status: EventStatus.CONFIRMED,
        organizer: 'Advanced Technology Corp.',
        cost: 1200.0,
        revenue: 2500.0,
      },
      {
        title: 'Smith-Williams Wedding',
        description:
          'Wedding celebration with ceremony, dinner, dancing and party for 150 guests.',
        eventDate: new Date('2024-12-22'),
        startTime: '18:00',
        endTime: '23:00',
        venue: 'Grand Ballroom',
        capacity: 200,
        attendees: 150,
        status: EventStatus.CONFIRMED,
        organizer: 'Smith Williams Family',
        cost: 2500.0,
        revenue: 8500.0,
      },
      {
        title: 'Innovative Product Launch',
        description:
          'Exclusive presentation of the new product with demonstrations, conferences and networking cocktail.',
        eventDate: new Date('2024-12-10'),
        startTime: '16:00',
        endTime: '20:00',
        venue: 'Garden Pavilion',
        capacity: 120,
        attendees: 85,
        status: EventStatus.COMPLETED,
        organizer: 'Innovation Labs Ltd.',
        cost: 1800.0,
        revenue: 4200.0,
      },
      {
        title: 'Shareholders Assembly',
        description:
          'Quarterly board meeting to review financial performance and strategic initiatives.',
        eventDate: new Date('2024-12-28'),
        startTime: '14:00',
        endTime: '18:00',
        venue: 'Executive Suite',
        capacity: 20,
        attendees: 18,
        status: EventStatus.PLANNED,
        organizer: 'American Business Group Inc.',
        cost: 800.0,
        revenue: 1600.0,
      },
      {
        title: "New Year's Eve Celebration",
        description:
          'Grand holiday celebration with gala dinner, live entertainment and annual awards.',
        eventDate: new Date('2024-12-31'),
        startTime: '19:00',
        endTime: '01:00',
        venue: 'Grand Ballroom',
        capacity: 200,
        attendees: 180,
        status: EventStatus.CONFIRMED,
        organizer: 'Hotel Management',
        cost: 3000.0,
        revenue: 12000.0,
      },
    ];

    for (const eventData of events) {
      const existing = await this.eventRepository.findOne({
        where: { title: eventData.title, eventDate: eventData.eventDate },
      });

      if (!existing) {
        await this.eventRepository.save(eventData);
      }
    }
  }
}
