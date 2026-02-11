import { RecreationalBooking } from './';
import {
  RecreationalBookingStatus,
  BookingPriority,
} from '@app/contracts/recreational-service';

describe('RecreationalBooking Entity', () => {
  it('should create an instance with default values', () => {
    const booking = new RecreationalBooking();
    expect(booking).toBeDefined();
    expect(booking).toBeInstanceOf(RecreationalBooking);
  });

  it('should accept all property assignments', () => {
    const booking = new RecreationalBooking();
    booking.id = 1;
    booking.guestName = 'John Doe';
    booking.guestEmail = 'john@example.com';
    booking.guestPhone = '+1234567890';
    booking.roomNumber = '301';
    booking.bookingDate = new Date('2024-06-15');
    booking.startTime = '10:00';
    booking.endTime = '12:00';
    booking.duration = 2;
    booking.participants = 3;
    booking.totalCost = 30;
    booking.status = RecreationalBookingStatus.CONFIRMED;
    booking.priority = BookingPriority.NORMAL;
    booking.specialRequests = 'Need towels';
    booking.staffNotes = 'VIP guest';
    booking.actualCheckIn = new Date();
    booking.actualCheckOut = new Date();
    booking.discountPercent = 10;
    booking.discountAmount = 3;
    booking.createdByUserId = 5;
    booking.facilityId = 1;
    booking.createdAt = new Date();
    booking.updatedAt = new Date();

    expect(booking.id).toBe(1);
    expect(booking.guestName).toBe('John Doe');
    expect(booking.guestEmail).toBe('john@example.com');
    expect(booking.guestPhone).toBe('+1234567890');
    expect(booking.roomNumber).toBe('301');
    expect(booking.startTime).toBe('10:00');
    expect(booking.endTime).toBe('12:00');
    expect(booking.duration).toBe(2);
    expect(booking.participants).toBe(3);
    expect(booking.totalCost).toBe(30);
    expect(booking.status).toBe(RecreationalBookingStatus.CONFIRMED);
    expect(booking.priority).toBe(BookingPriority.NORMAL);
    expect(booking.specialRequests).toBe('Need towels');
    expect(booking.staffNotes).toBe('VIP guest');
    expect(booking.discountPercent).toBe(10);
    expect(booking.discountAmount).toBe(3);
    expect(booking.createdByUserId).toBe(5);
    expect(booking.facilityId).toBe(1);
  });

  it('should handle optional properties as undefined', () => {
    const booking = new RecreationalBooking();
    expect(booking.guestPhone).toBeUndefined();
    expect(booking.roomNumber).toBeUndefined();
    expect(booking.specialRequests).toBeUndefined();
    expect(booking.staffNotes).toBeUndefined();
    expect(booking.actualCheckIn).toBeUndefined();
    expect(booking.actualCheckOut).toBeUndefined();
    expect(booking.discountPercent).toBeUndefined();
    expect(booking.discountAmount).toBeUndefined();
    expect(booking.createdByUserId).toBeUndefined();
  });

  it('should support all booking statuses', () => {
    const booking = new RecreationalBooking();
    const statuses = Object.values(RecreationalBookingStatus);
    for (const status of statuses) {
      booking.status = status;
      expect(booking.status).toBe(status);
    }
  });

  it('should support all booking priorities', () => {
    const booking = new RecreationalBooking();
    const priorities = Object.values(BookingPriority);
    for (const priority of priorities) {
      booking.priority = priority;
      expect(booking.priority).toBe(priority);
    }
  });
});
