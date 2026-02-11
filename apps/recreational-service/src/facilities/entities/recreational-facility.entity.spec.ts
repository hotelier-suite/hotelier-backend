import { RecreationalFacility } from './';
import {
  FacilityType,
  FacilityStatus,
} from '@app/contracts/recreational-service';

describe('RecreationalFacility Entity', () => {
  it('should create an instance with default values', () => {
    const facility = new RecreationalFacility();
    expect(facility).toBeDefined();
    expect(facility).toBeInstanceOf(RecreationalFacility);
  });

  it('should accept all property assignments', () => {
    const facility = new RecreationalFacility();
    facility.id = 1;
    facility.name = 'Olympic Pool';
    facility.type = FacilityType.SWIMMING_POOL;
    facility.status = FacilityStatus.AVAILABLE;
    facility.capacity = 25;
    facility.area = 500;
    facility.location = 'Ground Floor';
    facility.description = 'A swimming pool';
    facility.hourlyRate = 15;
    facility.available = true;
    facility.openingTime = '06:00';
    facility.closingTime = '22:00';
    facility.minimumBookingHours = 1;
    facility.maximumBookingHours = 4;
    facility.amenities = ['Pool towels', 'Showers'];
    facility.rules = ['No running'];
    facility.advanceBookingHours = 2;
    facility.availableDays = [1, 2, 3, 4, 5];
    facility.maintenanceNotes = 'Daily cleaning';
    facility.createdAt = new Date();
    facility.updatedAt = new Date();
    facility.bookings = [];

    expect(facility.id).toBe(1);
    expect(facility.name).toBe('Olympic Pool');
    expect(facility.type).toBe(FacilityType.SWIMMING_POOL);
    expect(facility.status).toBe(FacilityStatus.AVAILABLE);
    expect(facility.capacity).toBe(25);
    expect(facility.area).toBe(500);
    expect(facility.location).toBe('Ground Floor');
    expect(facility.description).toBe('A swimming pool');
    expect(facility.hourlyRate).toBe(15);
    expect(facility.available).toBe(true);
    expect(facility.openingTime).toBe('06:00');
    expect(facility.closingTime).toBe('22:00');
    expect(facility.minimumBookingHours).toBe(1);
    expect(facility.maximumBookingHours).toBe(4);
    expect(facility.amenities).toEqual(['Pool towels', 'Showers']);
    expect(facility.rules).toEqual(['No running']);
    expect(facility.advanceBookingHours).toBe(2);
    expect(facility.availableDays).toEqual([1, 2, 3, 4, 5]);
    expect(facility.maintenanceNotes).toBe('Daily cleaning');
    expect(facility.bookings).toEqual([]);
  });

  it('should handle optional properties as undefined', () => {
    const facility = new RecreationalFacility();
    expect(facility.area).toBeUndefined();
    expect(facility.description).toBeUndefined();
    expect(facility.hourlyRate).toBeUndefined();
    expect(facility.amenities).toBeUndefined();
    expect(facility.rules).toBeUndefined();
    expect(facility.advanceBookingHours).toBeUndefined();
    expect(facility.availableDays).toBeUndefined();
    expect(facility.maintenanceNotes).toBeUndefined();
  });

  it('should support all facility types', () => {
    const facility = new RecreationalFacility();
    const types = Object.values(FacilityType);
    for (const type of types) {
      facility.type = type;
      expect(facility.type).toBe(type);
    }
  });

  it('should support all facility statuses', () => {
    const facility = new RecreationalFacility();
    const statuses = Object.values(FacilityStatus);
    for (const status of statuses) {
      facility.status = status;
      expect(facility.status).toBe(status);
    }
  });
});
