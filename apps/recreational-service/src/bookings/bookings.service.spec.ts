import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { BookingsService } from './';
import { RecreationalBooking } from './entities';
import { RecreationalFacility } from '../facilities/entities';
import { NotificationsService } from '../notifications-service';
import {
  RecreationalBookingStatus,
  BookingPriority,
  FacilityStatus,
  FacilityType,
} from '@app/contracts/recreational-service';

describe('BookingsService', () => {
  let service: BookingsService;

  const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  const mockBookingRepository: Record<string, jest.Mock> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder),
  };

  const mockFacilityRepository: Record<string, jest.Mock> = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockNotificationsService = {
    create: jest.fn().mockReturnValue({ subscribe: jest.fn() }),
  };

  const mockFacility = {
    id: 1,
    name: 'Olympic Pool',
    type: FacilityType.SWIMMING_POOL,
    status: FacilityStatus.AVAILABLE,
    capacity: 25,
    available: true,
    openingTime: '06:00',
    closingTime: '22:00',
    minimumBookingHours: 1,
    maximumBookingHours: 4,
    availableDays: [0, 1, 2, 3, 4, 5, 6],
    location: 'Ground Floor',
  };

  const mockBooking = {
    id: 1,
    facilityId: 1,
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    bookingDate: new Date(2024, 5, 15),
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    participants: 3,
    totalCost: 30,
    status: RecreationalBookingStatus.CONFIRMED,
    priority: BookingPriority.NORMAL,
    createdAt: new Date(),
    updatedAt: new Date(),
    facility: {
      id: 1,
      name: 'Olympic Pool',
      type: FacilityType.SWIMMING_POOL,
      location: 'Ground Floor',
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingsService,
        {
          provide: getRepositoryToken(RecreationalBooking),
          useValue: mockBookingRepository,
        },
        {
          provide: getRepositoryToken(RecreationalFacility),
          useValue: mockFacilityRepository,
        },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
    mockBookingRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return bookings with no filters', async () => {
      mockBookingRepository.find.mockResolvedValueOnce([mockBooking]);
      const result = await service.findAll({});
      expect(mockBookingRepository.find).toHaveBeenCalled();
      expect(result).toEqual([mockBooking]);
    });

    it('should filter by date', async () => {
      mockBookingRepository.find.mockResolvedValueOnce([mockBooking]);
      await service.findAll({ date: new Date('2024-06-15') });
      expect(mockBookingRepository.find).toHaveBeenCalled();
    });

    it('should filter by facilityId', async () => {
      mockBookingRepository.find.mockResolvedValueOnce([]);
      await service.findAll({ facilityId: 1 });
      expect(mockBookingRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      const result = await service.findOne(1);
      expect(result).toBeDefined();
    });

    it('should throw RpcException when not found', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const dto = {
        facilityId: 1,
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        bookingDate: new Date('2024-06-17'),
        startTime: '10:00',
        endTime: '12:00',
        duration: 2,
        participants: 3,
      };
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockQueryBuilder.getMany.mockResolvedValueOnce([]);
      mockBookingRepository.create.mockReturnValueOnce({
        ...mockBooking,
        ...dto,
      });
      mockBookingRepository.save.mockResolvedValueOnce(mockBooking);
      const result = await service.create(dto);
      expect(result).toEqual(mockBooking);
    });

    it('should throw when facility not found', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(null);
      await expect(
        service.create({
          facilityId: 999,
          guestName: 'John',
          guestEmail: 'john@test.com',
          bookingDate: new Date(),
          startTime: '10:00',
          endTime: '12:00',
          duration: 2,
          participants: 1,
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when facility not available', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce({
        ...mockFacility,
        available: false,
      });
      await expect(
        service.create({
          facilityId: 1,
          guestName: 'John',
          guestEmail: 'john@test.com',
          bookingDate: new Date('2024-06-17'),
          startTime: '10:00',
          endTime: '12:00',
          duration: 2,
          participants: 1,
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when day not available', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce({
        ...mockFacility,
        availableDays: [1, 2, 3],
      });
      const sunday = new Date('2024-06-16');
      await expect(
        service.create({
          facilityId: 1,
          guestName: 'John',
          guestEmail: 'john@test.com',
          bookingDate: sunday,
          startTime: '10:00',
          endTime: '12:00',
          duration: 2,
          participants: 1,
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when outside operating hours', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      await expect(
        service.create({
          facilityId: 1,
          guestName: 'John',
          guestEmail: 'john@test.com',
          bookingDate: new Date('2024-06-17'),
          startTime: '04:00',
          endTime: '05:00',
          duration: 1,
          participants: 1,
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when duration out of range', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      await expect(
        service.create({
          facilityId: 1,
          guestName: 'John',
          guestEmail: 'john@test.com',
          bookingDate: new Date('2024-06-17'),
          startTime: '08:00',
          endTime: '15:00',
          duration: 7,
          participants: 1,
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when booking conflicts exist', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockQueryBuilder.getMany.mockResolvedValueOnce([{ id: 2 }]);
      await expect(
        service.create({
          facilityId: 1,
          guestName: 'John',
          guestEmail: 'john@test.com',
          bookingDate: new Date('2024-06-17'),
          startTime: '10:00',
          endTime: '12:00',
          duration: 2,
          participants: 1,
        }),
      ).rejects.toThrow(RpcException);
    });

    it('should throw when participants exceed capacity', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockQueryBuilder.getMany.mockResolvedValueOnce([]);
      await expect(
        service.create({
          facilityId: 1,
          guestName: 'John',
          guestEmail: 'john@test.com',
          bookingDate: new Date('2024-06-17'),
          startTime: '10:00',
          endTime: '12:00',
          duration: 2,
          participants: 100,
        }),
      ).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const updated = { ...mockBooking, participants: 5 };
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      mockBookingRepository.create.mockReturnValueOnce(mockBooking);
      mockBookingRepository.merge.mockReturnValueOnce(updated);
      mockBookingRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { participants: 5 });
      expect(result.participants).toBe(5);
    });

    it('should validate when changing time/facility', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockQueryBuilder.getMany.mockResolvedValueOnce([]);
      mockBookingRepository.create.mockReturnValueOnce(mockBooking);
      mockBookingRepository.merge.mockReturnValueOnce(mockBooking);
      mockBookingRepository.save.mockResolvedValueOnce(mockBooking);
      await service.update(1, { startTime: '14:00', endTime: '16:00' });
      expect(mockFacilityRepository.findOne).toHaveBeenCalled();
    });

    it('should throw when updated facility not found', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      mockFacilityRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.update(1, { facilityId: 999 })).rejects.toThrow(
        RpcException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a booking', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      mockBookingRepository.create.mockReturnValueOnce(mockBooking);
      mockBookingRepository.remove.mockResolvedValueOnce(mockBooking);
      const result = await service.remove(1);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('cancel', () => {
    it('should cancel a confirmed booking', async () => {
      const cancelled = {
        ...mockBooking,
        status: RecreationalBookingStatus.CANCELLED,
      };
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      mockBookingRepository.create.mockReturnValueOnce({
        ...mockBooking,
        facility: { name: 'Pool' },
        bookingDate: { toISOString: () => '2024-06-15T00:00:00.000Z' },
      });
      mockBookingRepository.save.mockResolvedValueOnce(cancelled);
      const result = await service.cancel(1, 'Guest request');
      expect(result.status).toBe(RecreationalBookingStatus.CANCELLED);
    });

    it('should cancel without reason', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      mockBookingRepository.create.mockReturnValueOnce({
        ...mockBooking,
        facility: { name: 'Pool' },
        bookingDate: { toISOString: () => '2024-06-15T00:00:00.000Z' },
      });
      mockBookingRepository.save.mockResolvedValueOnce({
        ...mockBooking,
        status: RecreationalBookingStatus.CANCELLED,
        staffNotes: 'Booking cancelled',
      });
      const result = await service.cancel(1);
      expect(result.status).toBe(RecreationalBookingStatus.CANCELLED);
    });

    it('should throw when cancelling completed booking', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce({
        ...mockBooking,
        status: RecreationalBookingStatus.COMPLETED,
      });
      await expect(service.cancel(1)).rejects.toThrow(RpcException);
    });
  });

  describe('checkIn', () => {
    it('should check in a confirmed booking', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      mockBookingRepository.create.mockReturnValueOnce({ ...mockBooking });
      mockBookingRepository.save.mockResolvedValueOnce({
        ...mockBooking,
        status: RecreationalBookingStatus.CHECKED_IN,
      });
      const result = await service.checkIn(1);
      expect(result.status).toBe(RecreationalBookingStatus.CHECKED_IN);
    });

    it('should throw when not confirmed', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce({
        ...mockBooking,
        status: RecreationalBookingStatus.PENDING,
      });
      await expect(service.checkIn(1)).rejects.toThrow(RpcException);
    });
  });

  describe('checkOut', () => {
    it('should check out a checked-in booking', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce({
        ...mockBooking,
        status: RecreationalBookingStatus.CHECKED_IN,
      });
      mockBookingRepository.create.mockReturnValueOnce({
        ...mockBooking,
        status: RecreationalBookingStatus.CHECKED_IN,
      });
      mockBookingRepository.save.mockResolvedValueOnce({
        ...mockBooking,
        status: RecreationalBookingStatus.COMPLETED,
      });
      const result = await service.checkOut(1);
      expect(result.status).toBe(RecreationalBookingStatus.COMPLETED);
    });

    it('should throw when not checked in', async () => {
      mockBookingRepository.findOne.mockResolvedValueOnce(mockBooking);
      await expect(service.checkOut(1)).rejects.toThrow(RpcException);
    });
  });

  describe('getStatistics', () => {
    it('should return booking statistics', async () => {
      const bookings = [
        {
          ...mockBooking,
          totalCost: 50,
          startTime: '10:00',
          status: RecreationalBookingStatus.CONFIRMED,
          facility: { type: FacilityType.SWIMMING_POOL },
        },
        {
          ...mockBooking,
          id: 2,
          totalCost: 30,
          startTime: '14:00',
          status: RecreationalBookingStatus.COMPLETED,
          facility: { type: FacilityType.GYM },
        },
      ];
      mockBookingRepository.find.mockResolvedValueOnce(bookings);
      mockFacilityRepository.find.mockResolvedValueOnce([mockFacility]);
      mockBookingRepository.find.mockResolvedValueOnce([]);
      const result = await service.getStatistics(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );
      expect(result.totalBookings).toBe(2);
      expect(result.totalRevenue).toBe(80);
    });

    it('should handle empty bookings', async () => {
      mockBookingRepository.find.mockResolvedValueOnce([]);
      mockFacilityRepository.find.mockResolvedValueOnce([]);
      const result = await service.getStatistics(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );
      expect(result.totalBookings).toBe(0);
      expect(result.averageBookingValue).toBe(0);
    });

    it('should handle all status types in breakdown', async () => {
      const allStatuses = [
        {
          ...mockBooking,
          status: RecreationalBookingStatus.PENDING,
          totalCost: 10,
          startTime: '09:00',
          facility: { type: FacilityType.GYM },
        },
        {
          ...mockBooking,
          status: RecreationalBookingStatus.CONFIRMED,
          totalCost: 10,
          startTime: '10:00',
          facility: { type: FacilityType.GYM },
        },
        {
          ...mockBooking,
          status: RecreationalBookingStatus.CHECKED_IN,
          totalCost: 10,
          startTime: '11:00',
          facility: { type: FacilityType.GYM },
        },
        {
          ...mockBooking,
          status: RecreationalBookingStatus.COMPLETED,
          totalCost: 10,
          startTime: '12:00',
          facility: { type: FacilityType.GYM },
        },
        {
          ...mockBooking,
          status: RecreationalBookingStatus.CANCELLED,
          totalCost: 10,
          startTime: '13:00',
          facility: { type: FacilityType.GYM },
        },
        {
          ...mockBooking,
          status: RecreationalBookingStatus.NO_SHOW,
          totalCost: 10,
          startTime: '14:00',
          facility: { type: FacilityType.GYM },
        },
      ];
      mockBookingRepository.find.mockResolvedValueOnce(allStatuses);
      mockFacilityRepository.find.mockResolvedValueOnce([]);
      const result = await service.getStatistics(
        new Date('2024-01-01'),
        new Date('2024-12-31'),
      );
      expect(result.statusBreakdown.pending).toBe(1);
      expect(result.statusBreakdown.confirmed).toBe(1);
      expect(result.statusBreakdown.checkedIn).toBe(1);
      expect(result.statusBreakdown.completed).toBe(1);
      expect(result.statusBreakdown.cancelled).toBe(1);
      expect(result.statusBreakdown.noShow).toBe(1);
    });
  });
});
