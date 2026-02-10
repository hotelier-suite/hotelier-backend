import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecreationalBooking } from '../../bookings';
import { RecreationalFacility } from '../../facilities';
import {
  RecreationalBookingStatus,
  BookingPriority,
} from '@app/contracts/recreational-service';
import { RecreationalBookingInput } from '../interfaces';

@Injectable()
export class RecreationalBookingsSeeder {
  constructor(
    @InjectRepository(RecreationalBooking)
    private readonly bookingRepository: Repository<RecreationalBooking>,
    @InjectRepository(RecreationalFacility)
    private readonly facilityRepository: Repository<RecreationalFacility>,
  ) {}

  async seed() {
    const existingCount = await this.bookingRepository.count();
    if (existingCount > 0) {
      console.log('⏭️ Recreational bookings already exist, skipping seeding');
      return;
    }

    const facilities = await this.facilityRepository.find();
    if (facilities.length === 0) {
      console.log('⚠️ No facilities found, skipping booking seeding');
      return;
    }

    const today = new Date();
    const bookings: RecreationalBookingInput[] = [];

    const guests = [
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@gmail.com',
        phone: '+1-555-234-5678',
        room: '301',
      },
      {
        name: 'Michael Williams',
        email: 'michael.williams@hotmail.com',
        phone: '+1-555-345-6789',
        room: '205',
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@yahoo.com',
        phone: '+1-555-456-7890',
        room: '412',
      },
      {
        name: 'James Miller',
        email: 'james.miller@outlook.com',
        phone: '+1-555-567-8901',
        room: '308',
      },
      {
        name: 'Jessica Brown',
        email: 'jessica.brown@gmail.com',
        phone: '+1-555-678-9012',
        room: '506',
      },
      {
        name: 'David Wilson',
        email: 'david.wilson@aol.com',
        phone: '+1-555-789-0123',
        room: '203',
      },
      {
        name: 'Ashley Taylor',
        email: 'ashley.taylor@gmail.com',
        phone: '+1-555-890-1234',
        room: '711',
      },
      {
        name: 'Christopher Anderson',
        email: 'chris.anderson@outlook.com',
        phone: '+1-555-901-2345',
        room: '115',
      },
      {
        name: 'Amanda Thomas',
        email: 'amanda.thomas@hotmail.com',
        phone: '+1-555-012-3456',
        room: '609',
      },
      {
        name: 'Matthew Jackson',
        email: 'matt.jackson@gmail.com',
        phone: '+1-555-123-4567',
        room: '404',
      },
    ];

    const timeSlots = [
      { start: '09:00', end: '10:00', duration: 1 },
      { start: '10:00', end: '12:00', duration: 2 },
      { start: '14:00', end: '15:00', duration: 1 },
      { start: '15:00', end: '17:00', duration: 2 },
      { start: '17:00', end: '18:00', duration: 1 },
      { start: '18:00', end: '20:00', duration: 2 },
    ];

    const priorities = [
      BookingPriority.NORMAL,
      BookingPriority.HIGH,
      BookingPriority.VIP,
    ];

    const specialRequests = [
      'Please provide towels for 3 guests',
      'First time using the facility - needs orientation',
      'VIP guest - provide premium service',
      'Celebrating anniversary - special setup requested',
      null,
      null,
    ];

    for (let dayOffset = -7; dayOffset <= 30; dayOffset++) {
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + dayOffset);
      bookingDate.setHours(0, 0, 0, 0);

      const bookingsPerDay = Math.floor(Math.random() * 3) + 2;

      for (let i = 0; i < bookingsPerDay; i++) {
        const facility =
          facilities[Math.floor(Math.random() * facilities.length)];
        const guest = guests[Math.floor(Math.random() * guests.length)];
        const timeSlot =
          timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const participants =
          Math.floor(Math.random() * Math.min(facility.capacity, 6)) + 1;

        let status: RecreationalBookingStatus;
        let actualCheckIn: Date | undefined;
        let actualCheckOut: Date | undefined;

        if (dayOffset < -2) {
          status =
            Math.random() > 0.1
              ? RecreationalBookingStatus.COMPLETED
              : RecreationalBookingStatus.CANCELLED;
          if (status === RecreationalBookingStatus.COMPLETED) {
            actualCheckIn = new Date(bookingDate);
            actualCheckIn.setHours(
              parseInt(timeSlot.start.split(':')[0]),
              parseInt(timeSlot.start.split(':')[1]),
            );
            actualCheckOut = new Date(bookingDate);
            actualCheckOut.setHours(
              parseInt(timeSlot.end.split(':')[0]),
              parseInt(timeSlot.end.split(':')[1]),
            );
          }
        } else if (dayOffset === 0) {
          status =
            Math.random() > 0.5
              ? RecreationalBookingStatus.CONFIRMED
              : RecreationalBookingStatus.CHECKED_IN;
        } else {
          status =
            Math.random() > 0.3
              ? RecreationalBookingStatus.CONFIRMED
              : RecreationalBookingStatus.PENDING;
        }

        const booking = {
          guestName: guest.name,
          guestEmail: guest.email,
          guestPhone: guest.phone,
          roomNumber: guest.room,
          bookingDate,
          startTime: timeSlot.start,
          endTime: timeSlot.end,
          duration: timeSlot.duration,
          participants,
          totalCost: 0,
          status,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          specialRequests:
            specialRequests[
              Math.floor(Math.random() * specialRequests.length)
            ] || undefined,
          staffNotes:
            status === RecreationalBookingStatus.CANCELLED
              ? 'Guest requested cancellation'
              : undefined,
          actualCheckIn,
          actualCheckOut,
          facilityId: facility.id,
        };

        bookings.push(booking);
      }
    }

    for (const booking of bookings) {
      await this.bookingRepository.save(booking);
    }

    console.log(`✨ Created ${bookings.length} recreational bookings`);
  }
}
