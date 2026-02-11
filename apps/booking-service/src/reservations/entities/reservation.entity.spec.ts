jest.mock('../../guests', () => ({
  Guest: class Guest {},
}));

jest.mock('../../rooms', () => ({
  Room: class Room {},
}));

import { Reservation } from './';

describe('Reservation Entity', () => {
  it('should create a reservation instance with all properties', () => {
    const reservation = new Reservation();
    reservation.id = 1;
    reservation.guestName = 'John Smith';
    reservation.guestEmail = 'john@example.com';
    reservation.guestPhone = '+1234567890';
    reservation.checkInDate = new Date(2024, 5, 15);
    reservation.checkOutDate = new Date(2024, 5, 18);
    reservation.nights = 3;
    reservation.guests = 2;
    reservation.totalAmount = 225.0;
    reservation.discountPercent = 10;
    reservation.discountAmount = 20;
    reservation.status = 'CONFIRMED' as never;
    reservation.channel = 'DIRECT' as never;
    reservation.notes = 'Anniversary';
    reservation.createdAt = new Date(2024, 5, 15);
    reservation.updatedAt = new Date(2024, 5, 15);
    reservation.userId = 1;
    reservation.roomId = 101;
    reservation.guestId = 5;

    expect(reservation.id).toBe(1);
    expect(reservation.guestName).toBe('John Smith');
    expect(reservation.guestEmail).toBe('john@example.com');
    expect(reservation.guestPhone).toBe('+1234567890');
    expect(reservation.nights).toBe(3);
    expect(reservation.guests).toBe(2);
    expect(reservation.totalAmount).toBe(225.0);
    expect(reservation.discountPercent).toBe(10);
    expect(reservation.discountAmount).toBe(20);
    expect(reservation.notes).toBe('Anniversary');
    expect(reservation.userId).toBe(1);
    expect(reservation.roomId).toBe(101);
    expect(reservation.guestId).toBe(5);
  });

  it('should allow optional fields to be undefined', () => {
    const reservation = new Reservation();
    reservation.id = 2;
    reservation.guestName = 'Jane';
    reservation.guestEmail = 'jane@example.com';
    reservation.checkInDate = new Date();
    reservation.checkOutDate = new Date();
    reservation.nights = 1;
    reservation.guests = 1;
    reservation.totalAmount = 50;
    reservation.roomId = 1;
    reservation.createdAt = new Date();
    reservation.updatedAt = new Date();

    expect(reservation.guestPhone).toBeUndefined();
    expect(reservation.discountPercent).toBeUndefined();
    expect(reservation.discountAmount).toBeUndefined();
    expect(reservation.notes).toBeUndefined();
    expect(reservation.userId).toBeUndefined();
    expect(reservation.guestId).toBeUndefined();
  });
});
