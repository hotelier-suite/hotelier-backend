// Break circular dependency: event-booking.entity -> ../../venues barrel
jest.mock('../venues', () => ({
  Venue: class Venue {},
}));

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';
import { EventBooking } from './entities';
import { Venue } from '../venues';
import { EventStatus } from '@app/contracts/events-service';

describe('BookingsService', () => {
  let service: BookingsService;
  let bookingRepo: Record<string, jest.Mock>;
  let venueRepo: Record<string, jest.Mock>;

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
    bookingRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      merge: jest.fn(),
      remove: jest.fn(),
    };

    venueRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        { provide: getRepositoryToken(EventBooking), useValue: bookingRepo },
        { provide: getRepositoryToken(Venue), useValue: venueRepo },
      ],
    }).compile();

    service = module.get(BookingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all bookings with empty filters', async () => {
      bookingRepo.find.mockResolvedValueOnce([mockBooking]);
      const result = await service.findAll({});
      expect(result).toEqual([mockBooking]);
      expect(bookingRepo.find).toHaveBeenCalledWith(
        expect.objectContaining({ order: { eventDate: 'ASC' } }),
      );
    });

    it('should filter by upcoming events', async () => {
      bookingRepo.find.mockResolvedValueOnce([mockBooking]);
      await service.findAll({ isUpcoming: true });
      expect(bookingRepo.find).toHaveBeenCalled();
    });

    it('should filter by status', async () => {
      bookingRepo.find.mockResolvedValueOnce([mockBooking]);
      await service.findAll({ status: EventStatus.CONFIRMED });
      expect(bookingRepo.find).toHaveBeenCalled();
    });

    it('should filter by guestId', async () => {
      bookingRepo.find.mockResolvedValueOnce([mockBooking]);
      await service.findAll({ guestId: 5 });
      expect(bookingRepo.find).toHaveBeenCalled();
    });

    it('should filter by venueId', async () => {
      bookingRepo.find.mockResolvedValueOnce([mockBooking]);
      await service.findAll({ venueId: 1 });
      expect(bookingRepo.find).toHaveBeenCalled();
    });

    it('should filter by date range (both start and end)', async () => {
      bookingRepo.find.mockResolvedValueOnce([mockBooking]);
      await service.findAll({
        startDate: new Date('2024-12-01'),
        endDate: new Date('2024-12-31'),
      });
      expect(bookingRepo.find).toHaveBeenCalled();
    });

    it('should filter by startDate only', async () => {
      bookingRepo.find.mockResolvedValueOnce([mockBooking]);
      await service.findAll({ startDate: new Date('2024-12-01') });
      expect(bookingRepo.find).toHaveBeenCalled();
    });

    it('should filter by endDate only', async () => {
      bookingRepo.find.mockResolvedValueOnce([mockBooking]);
      await service.findAll({ endDate: new Date('2024-12-31') });
      expect(bookingRepo.find).toHaveBeenCalled();
    });

    it('should return empty array when no bookings match', async () => {
      bookingRepo.find.mockResolvedValueOnce([]);
      const result = await service.findAll({});
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a single booking by id', async () => {
      bookingRepo.findOne.mockResolvedValueOnce(mockBooking);
      const result = await service.findOne(1);
      expect(result).toEqual(mockBooking);
      expect(bookingRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
    });

    it('should throw RpcException when booking not found', async () => {
      bookingRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create a booking with calculated cost', async () => {
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
      // hourlyRate=500, duration=4hrs => 2000
      const entity = { ...createDto, venue: mockVenue, totalCost: 2000 };
      const saved = { ...mockBooking, ...createDto, totalCost: 2000, id: 2 };

      venueRepo.findOne.mockResolvedValueOnce(mockVenue);
      bookingRepo.create.mockReturnValueOnce(entity);
      bookingRepo.save.mockResolvedValueOnce(saved);

      const result = await service.create(createDto);
      expect(result).toEqual(saved);
      expect(venueRepo.findOne).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 1 } }),
      );
      expect(bookingRepo.save).toHaveBeenCalled();
    });

    it('should throw RpcException when venue not found during create', async () => {
      const createDto = {
        title: 'New Booking',
        eventDate: new Date('2024-12-20'),
        startTime: '10:00',
        endTime: '14:00',
        attendees: 50,
        clientName: 'Jane Doe',
        clientEmail: 'jane@test.com',
        venueId: 999,
      };
      venueRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.create(createDto)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a booking and recalculate cost', async () => {
      const updateDto = { startTime: '09:00', endTime: '15:00' };
      // hourlyRate=500, duration=6hrs => 3000
      const entity = { ...mockBooking };
      const merged = { ...mockBooking, ...updateDto, totalCost: 3000 };

      bookingRepo.findOne.mockResolvedValueOnce(mockBooking);
      venueRepo.findOne.mockResolvedValueOnce(mockVenue);
      bookingRepo.create.mockReturnValueOnce(entity);
      bookingRepo.merge.mockReturnValueOnce(merged);
      bookingRepo.save.mockResolvedValueOnce(merged);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(merged);
    });

    it('should use existing times when not provided in update', async () => {
      const updateDto = { title: 'Updated Booking' };
      const entity = { ...mockBooking };
      const merged = { ...mockBooking, ...updateDto };

      bookingRepo.findOne.mockResolvedValueOnce(mockBooking);
      venueRepo.findOne.mockResolvedValueOnce(mockVenue);
      bookingRepo.create.mockReturnValueOnce(entity);
      bookingRepo.merge.mockReturnValueOnce(merged);
      bookingRepo.save.mockResolvedValueOnce(merged);

      const result = await service.update(1, updateDto);
      expect(result).toEqual(merged);
    });

    it('should throw RpcException when booking to update not found', async () => {
      bookingRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(999, { title: 'X' })).rejects.toThrow(
        RpcException,
      );
    });

    it('should throw RpcException when venue not found during update', async () => {
      bookingRepo.findOne.mockResolvedValueOnce(mockBooking);
      venueRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.update(1, { venueId: 999 })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove and return the booking', async () => {
      const entity = { ...mockBooking };
      bookingRepo.findOne.mockResolvedValueOnce(mockBooking);
      bookingRepo.create.mockReturnValueOnce(entity);
      bookingRepo.remove.mockResolvedValueOnce(mockBooking);
      const result = await service.remove(1);
      expect(result).toEqual(mockBooking);
      expect(bookingRepo.remove).toHaveBeenCalledWith(entity);
    });

    it('should throw RpcException when booking to remove not found', async () => {
      bookingRepo.findOne.mockResolvedValueOnce(null);
      await expect(service.remove(999)).rejects.toThrow(RpcException);
    });
  });

  describe('calculateBookingCost (via create)', () => {
    it('should handle fractional hours', async () => {
      const createDto = {
        title: 'Short Meeting',
        eventDate: new Date('2024-12-20'),
        startTime: '10:00',
        endTime: '10:30',
        attendees: 10,
        clientName: 'John',
        clientEmail: 'john@test.com',
        venueId: 1,
      };
      // hourlyRate=500, duration=0.5hrs => 250
      const entity = { ...createDto, venue: mockVenue, totalCost: 250 };
      const saved = { ...mockBooking, ...createDto, totalCost: 250, id: 3 };

      venueRepo.findOne.mockResolvedValueOnce(mockVenue);
      bookingRepo.create.mockReturnValueOnce(entity);
      bookingRepo.save.mockResolvedValueOnce(saved);

      const result = await service.create(createDto);
      expect(result.totalCost).toBe(250);
    });

    it('should throw RpcException for negative duration', async () => {
      const createDto = {
        title: 'Bad Booking',
        eventDate: new Date('2024-12-20'),
        startTime: '15:00',
        endTime: '10:00',
        attendees: 10,
        clientName: 'John',
        clientEmail: 'john@test.com',
        venueId: 1,
      };
      venueRepo.findOne.mockResolvedValueOnce(mockVenue);
      await expect(service.create(createDto)).rejects.toThrow(RpcException);
    });
  });
});
