jest.mock('../../reservations', () => ({
  Reservation: class Reservation {},
}));

import { Guest } from './';

describe('Guest Entity', () => {
  it('should create a guest instance', () => {
    const guest = new Guest();
    guest.id = 1;
    guest.name = 'John Smith';
    guest.email = 'john@example.com';
    guest.phone = '+1234567890';
    guest.document = 'ABC123';
    guest.address = '123 Main St';
    guest.nationality = 'American';
    guest.vip = false;
    guest.createdAt = new Date(2024, 5, 15);
    guest.updatedAt = new Date(2024, 5, 15);
    guest.reservations = [];

    expect(guest.id).toBe(1);
    expect(guest.name).toBe('John Smith');
    expect(guest.email).toBe('john@example.com');
    expect(guest.phone).toBe('+1234567890');
    expect(guest.document).toBe('ABC123');
    expect(guest.address).toBe('123 Main St');
    expect(guest.nationality).toBe('American');
    expect(guest.vip).toBe(false);
    expect(guest.createdAt).toBeInstanceOf(Date);
    expect(guest.updatedAt).toBeInstanceOf(Date);
    expect(guest.reservations).toEqual([]);
  });

  it('should allow optional fields to be undefined', () => {
    const guest = new Guest();
    guest.id = 2;
    guest.name = 'Jane';
    guest.email = 'jane@example.com';
    guest.vip = true;
    guest.createdAt = new Date();
    guest.updatedAt = new Date();

    expect(guest.phone).toBeUndefined();
    expect(guest.document).toBeUndefined();
    expect(guest.address).toBeUndefined();
    expect(guest.nationality).toBeUndefined();
    expect(guest.birthDate).toBeUndefined();
    expect(guest.preferences).toBeUndefined();
  });
});
