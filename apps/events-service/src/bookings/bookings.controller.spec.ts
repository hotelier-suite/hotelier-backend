// Break circular dependency: event-booking.entity -> ../../venues barrel
jest.mock('../venues', () => ({
  Venue: class Venue {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { EventStatus } from '@app/contracts/events-service';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockVenue = {
    id: 1,
    name: 'Grand Ballroom',
    capacity: 200,
    area: 400.0,
    hourlyRate: 500.0,
    available: true,
    location: 'Main Building',
    description: 'Elegant ballroom.',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBooking = {
    id: 1,
    title: 'Smith Family Reunion',
    description: 'Annual family gathering.',
    eventDate: new Date('2024-12-14'),
    startTime: '11:00',
    endTime: '16:00',
    attendees: 80,
    totalCost: 2500.0,
    status: EventStatus.CONFIRMED,
    clientName: 'James Smith',
    clientEmail: 'james.smith@gmail.com',
    clientPhone: '+1 555 1234',
    notes: 'Vegetarian options required',
    venueId: 1,
    venue: mockVenue,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [
        {
          provide: BookingsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(BookingsController);
    service = module.get(BookingsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of bookings with empty filters', async () => {
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockBooking]);
      const result = await controller.findAll({});
      expect(result).toEqual([mockBooking]);
      expect(spy).toHaveBeenCalledWith({});
    });

    it('should pass filters to service', async () => {
      const filters = { status: EventStatus.CONFIRMED, isUpcoming: true };
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockBooking]);
      const result = await controller.findAll(filters);
      expect(result).toEqual([mockBooking]);
      expect(spy).toHaveBeenCalledWith(filters);
    });
  });

  describe('findOne', () => {
    it('should return a single booking', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockBooking);
      const result = await controller.findOne(1);
      expect(result).toEqual(mockBooking);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });

  describe('create', () => {
    it('should create and return a new booking', async () => {
      const createDto = {
        title: 'New Booking',
        eventDate: new Date('2024-12-20'),
        startTime: '10:00',
        endTime: '14:00',
        attendees: 50,
        clientName: 'Jane Doe',
        clientEmail: 'jane@test.com',
        venueId: 1,
      };
      const created = { ...mockBooking, ...createDto, id: 2 };
      const spy = jest.spyOn(service, 'create').mockResolvedValueOnce(created);
      const result = await controller.create(createDto);
      expect(result).toEqual(created);
      expect(spy).toHaveBeenCalledWith(createDto);
    });
  });

  describe('update', () => {
    it('should update and return the booking', async () => {
      const updateDto = { title: 'Updated Booking' };
      const updated = { ...mockBooking, ...updateDto };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data: updateDto });
      expect(result).toEqual(updated);
      expect(spy).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should remove and return the booking', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockBooking);
      const result = await controller.remove(1);
      expect(result).toEqual(mockBooking);
      expect(spy).toHaveBeenCalledWith(1);
    });
  });
});
