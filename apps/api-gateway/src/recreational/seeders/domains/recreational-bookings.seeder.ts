import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RecreationalBooking } from '../../entities/recreational-booking.entity';
import { RecreationalFacility } from '../../entities/recreational-facility.entity';
import { RecreationalBookingStatus } from '../../enums/booking-status.enum';
import { BookingPriority } from '../../enums/booking-priority.enum';

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

    // Create bookings for the next 30 days
    const today = new Date();
    const bookings: any[] = [];

    // Sample guest data - American context
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
      {
        name: 'Jennifer White',
        email: 'jennifer.white@yahoo.com',
        phone: '+1-555-234-5679',
        room: '512',
      },
      {
        name: 'Daniel Harris',
        email: 'daniel.harris@gmail.com',
        phone: '+1-555-345-6780',
        room: '208',
      },
      {
        name: 'Stephanie Martin',
        email: 'stephanie.martin@outlook.com',
        phone: '+1-555-456-7891',
        room: '315',
      },
      {
        name: 'Andrew Thompson',
        email: 'andrew.thompson@hotmail.com',
        phone: '+1-555-567-8902',
        room: '420',
      },
      {
        name: 'Lauren Williams',
        email: 'lauren.garcia@gmail.com',
        phone: '+1-555-678-9013',
        room: '607',
      },
    ];

    // Time slots for bookings
    const timeSlots = [
      { start: '09:00', end: '10:00', duration: 1 },
      { start: '10:00', end: '12:00', duration: 2 },
      { start: '14:00', end: '15:00', duration: 1 },
      { start: '15:00', end: '17:00', duration: 2 },
      { start: '17:00', end: '18:00', duration: 1 },
      { start: '18:00', end: '20:00', duration: 2 },
      { start: '20:00', end: '21:00', duration: 1 },
    ];

    const statuses = [
      RecreationalBookingStatus.PENDING,
      RecreationalBookingStatus.CONFIRMED,
      RecreationalBookingStatus.CHECKED_IN,
      RecreationalBookingStatus.COMPLETED,
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
      'Medical condition - needs assistance',
      'Group booking - corporate event',
      'Family with small children - special supervision',
      'Requests relaxing music during session',
      'Prefers extra cold water',
      'Needs adapted exercise equipment',
      'Foreign guest - English attention required',
      'Birthday celebration - decoration requested',
      null,
      null, // Most bookings won't have special requests
      null,
    ];

    // Generate bookings for each day
    for (let dayOffset = -7; dayOffset <= 30; dayOffset++) {
      const bookingDate = new Date(today);
      bookingDate.setDate(today.getDate() + dayOffset);
      bookingDate.setHours(0, 0, 0, 0);

      // Create 2-5 random bookings per day
      const bookingsPerDay = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < bookingsPerDay; i++) {
        const facility =
          facilities[Math.floor(Math.random() * facilities.length)];
        const guest = guests[Math.floor(Math.random() * guests.length)];
        const timeSlot =
          timeSlots[Math.floor(Math.random() * timeSlots.length)];
        const participants =
          Math.floor(Math.random() * Math.min(facility.capacity, 6)) + 1;

        // Calculate cost
        let totalCost = Number(facility.hourlyRate) * timeSlot.duration;

        // Apply random discount sometimes
        const discountPercent =
          Math.random() > 0.8 ? Math.floor(Math.random() * 20) + 5 : 0;
        const discountAmount =
          Math.random() > 0.9 ? Math.floor(Math.random() * 10) + 5 : 0;

        if (discountPercent > 0) {
          totalCost = totalCost * (1 - discountPercent / 100);
        }
        if (discountAmount > 0) {
          totalCost = Math.max(0, totalCost - discountAmount);
        }

        // Determine status based on date
        let status;
        let actualCheckIn: Date | null = null;
        let actualCheckOut: Date | null = null;

        if (dayOffset < -2) {
          // Past bookings are mostly completed
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
        } else if (dayOffset < 0) {
          // Recent past bookings
          status = statuses[Math.floor(Math.random() * statuses.length)];
        } else if (dayOffset === 0) {
          // Today's bookings - mix of statuses
          const todayStatuses = [
            RecreationalBookingStatus.CONFIRMED,
            RecreationalBookingStatus.CHECKED_IN,
          ];
          status =
            todayStatuses[Math.floor(Math.random() * todayStatuses.length)];
        } else {
          // Future bookings are pending or confirmed
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
          totalCost: Math.round(totalCost * 100) / 100,
          status: status as RecreationalBookingStatus,
          priority: priorities[Math.floor(Math.random() * priorities.length)],
          specialRequests:
            specialRequests[
              Math.floor(Math.random() * specialRequests.length)
            ] || undefined,
          staffNotes:
            status === RecreationalBookingStatus.CANCELLED
              ? 'Guest requested cancellation'
              : undefined,
          actualCheckIn: actualCheckIn || undefined,
          actualCheckOut: actualCheckOut || undefined,
          discountPercent: discountPercent > 0 ? discountPercent : undefined,
          discountAmount: discountAmount > 0 ? discountAmount : undefined,
          facilityId: facility.id,
        };

        bookings.push(booking);
      }
    }

    // Save bookings in batches to avoid overwhelming the database
    const batchSize = 50;
    for (let i = 0; i < bookings.length; i += batchSize) {
      const batch = bookings.slice(i, i + batchSize);
      for (const booking of batch) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const bookingEntity = this.bookingRepository.create(booking);
        await this.bookingRepository.save(bookingEntity);
      }
    }

    console.log(
      `✨ Created ${bookings.length} recreational bookings across multiple facilities and dates`,
    );
  }
}
