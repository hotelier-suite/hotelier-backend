import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EventBooking } from '../../entities/event-booking.entity';
import { Venue } from '../../../venues/entities/venue.entity';
import { EventStatus } from '../../enums/event-status.enum';

@Injectable()
export class EventBookingsSeeder {
  constructor(
    @InjectRepository(EventBooking)
    private eventBookingRepository: Repository<EventBooking>,
    @InjectRepository(Venue)
    private venueRepository: Repository<Venue>,
  ) {}

  async seed() {
    const venues = await this.venueRepository.find();

    if (venues.length === 0) {
      console.log('Skipping event booking seeds - no venues found');
      return;
    }

    const eventBookings = [
      {
        title: 'Smith Family Reunion',
        description:
          'Annual family gathering with lunch, activities and celebration for the extended family.',
        eventDate: new Date('2024-12-14'),
        startTime: '11:00',
        endTime: '16:00',
        attendees: 80,
        totalCost: 2400.0,
        status: EventStatus.CONFIRMED,
        clientName: 'James Smith',
        clientEmail: 'james.smith@gmail.com',
        clientPhone: '+57 310 123 4567',
        notes: 'Family has dietary restrictions - require vegetarian options',
        venueId:
          venues.find((v) => v.name === 'Garden Pavilion')?.id || venues[0].id,
      },
      {
        title: 'TechCol Investor Presentation',
        description:
          'Business proposal presentation to potential investors with Q&A session and networking.',
        eventDate: new Date('2024-12-20'),
        startTime: '13:00',
        endTime: '17:00',
        attendees: 35,
        totalCost: 1050.0,
        status: EventStatus.PLANNED,
        clientName: 'Sarah Thompson',
        clientEmail: 'sarah.thompson@techcorp.com',
        clientPhone: '+57 320 456 7890',
        notes: 'Need live streaming setup and recording equipment',
        venueId:
          venues.find((v) => v.name === 'Conference Room Alpha')?.id ||
          venues[0].id,
      },
      {
        title: 'Golden Wedding Anniversary Celebration',
        description:
          '50th wedding anniversary celebration with dinner and dancing for family and friends.',
        eventDate: new Date('2024-12-25'),
        startTime: '17:00',
        endTime: '22:00',
        attendees: 120,
        totalCost: 6000.0,
        status: EventStatus.CONFIRMED,
        clientName: 'Robert and Linda Taylor',
        clientEmail: 'rtaylor@hotmail.com',
        clientPhone: '+57 315 789 0123',
        notes: 'Anniversary cake and special decoration required',
        venueId:
          venues.find((v) => v.name === 'Main Ballroom')?.id || venues[0].id,
      },
      {
        title: 'Quarterly Sales Meeting',
        description:
          'Regional sales team meeting with performance review and planning session.',
        eventDate: new Date('2024-12-18'),
        startTime: '09:00',
        endTime: '15:00',
        attendees: 15,
        totalCost: 1200.0,
        status: EventStatus.IN_PROGRESS,
        clientName: 'Michael Carter',
        clientEmail: 'mcastro@ventascolombia.com',
        clientPhone: '+57 301 234 5678',
        notes: 'Lunch included in catering, need flipcharts and markers',
        venueId:
          venues.find((v) => v.name === 'Executive Room')?.id || venues[0].id,
      },
    ];

    for (const bookingData of eventBookings) {
      const existing = await this.eventBookingRepository.findOne({
        where: {
          title: bookingData.title,
          clientEmail: bookingData.clientEmail,
        },
      });

      if (!existing) {
        await this.eventBookingRepository.save(bookingData);
      }
    }
  }
}
