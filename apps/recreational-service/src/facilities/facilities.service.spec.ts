import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RpcException } from '@nestjs/microservices';
import { FacilitiesService } from './';
import { RecreationalFacility } from './entities';
import { RecreationalBooking } from '../bookings/entities';
import { NotificationsService } from '../notifications-service';
import {
  FacilityType,
  FacilityStatus,
  RecreationalBookingStatus,
} from '@app/contracts/recreational-service';

describe('FacilitiesService', () => {
  let service: FacilitiesService;

  const mockFacilityRepository: Record<string, jest.Mock> = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockBookingRepository: Record<string, jest.Mock> = {
    count: jest.fn(),
    find: jest.fn(),
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
    area: 500,
    location: 'Ground Floor',
    description: 'A pool',
    hourlyRate: 15,
    available: true,
    openingTime: '06:00',
    closingTime: '22:00',
    minimumBookingHours: 1,
    maximumBookingHours: 4,
    amenities: ['Towels'],
    rules: ['No food'],
    advanceBookingHours: 2,
    availableDays: [0, 1, 2, 3, 4, 5, 6],
    maintenanceNotes: 'Daily cleaning',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FacilitiesService,
        {
          provide: getRepositoryToken(RecreationalFacility),
          useValue: mockFacilityRepository,
        },
        {
          provide: getRepositoryToken(RecreationalBooking),
          useValue: mockBookingRepository,
        },
        { provide: NotificationsService, useValue: mockNotificationsService },
      ],
    }).compile();

    service = module.get<FacilitiesService>(FacilitiesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a facility and send notification', async () => {
      const dto = {
        name: 'Olympic Pool',
        type: FacilityType.SWIMMING_POOL,
        capacity: 25,
        location: 'Ground Floor',
        available: true,
        openingTime: '06:00',
        closingTime: '22:00',
        minimumBookingHours: 1,
        maximumBookingHours: 4,
      };
      mockFacilityRepository.create.mockReturnValueOnce(mockFacility);
      mockFacilityRepository.save.mockResolvedValueOnce(mockFacility);
      const result = await service.create(dto);
      expect(result).toEqual(mockFacility);
      expect(mockNotificationsService.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all facilities', async () => {
      mockFacilityRepository.find.mockResolvedValueOnce([mockFacility]);
      const result = await service.findAll({});
      expect(result).toEqual([mockFacility]);
    });

    it('should apply filters', async () => {
      mockFacilityRepository.find.mockResolvedValueOnce([]);
      await service.findAll({ type: FacilityType.GYM });
      expect(mockFacilityRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({ where: { type: FacilityType.GYM } }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a facility by id', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      const result = await service.findOne(1);
      expect(result).toEqual(mockFacility);
    });

    it('should throw RpcException when not found', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(RpcException);
    });
  });

  describe('update', () => {
    it('should update a facility', async () => {
      const updated = { ...mockFacility, name: 'Updated Pool' };
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockFacilityRepository.create.mockReturnValueOnce(mockFacility);
      mockFacilityRepository.merge.mockReturnValueOnce(updated);
      mockFacilityRepository.save.mockResolvedValueOnce(updated);
      const result = await service.update(1, { name: 'Updated Pool' });
      expect(result.name).toBe('Updated Pool');
    });
  });

  describe('remove', () => {
    it('should remove a facility with no active bookings', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockBookingRepository.count.mockResolvedValueOnce(0);
      mockFacilityRepository.create.mockReturnValueOnce(mockFacility);
      mockFacilityRepository.remove.mockResolvedValueOnce(mockFacility);
      const result = await service.remove(1);
      expect(result).toEqual(mockFacility);
    });

    it('should throw when facility has active bookings', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockBookingRepository.count.mockResolvedValueOnce(3);
      await expect(service.remove(1)).rejects.toThrow(RpcException);
    });
  });

  describe('getAvailability', () => {
    it('should return availability with time slots', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockBookingRepository.find.mockResolvedValueOnce([]);
      const result = await service.getAvailability(1, new Date(2024, 5, 17));
      expect(result.facilityId).toBe(1);
      expect(result.facilityName).toBe('Olympic Pool');
      expect(result.availableSlots.length).toBeGreaterThan(0);
    });

    it('should throw when facility not found', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(null);
      await expect(service.getAvailability(999, new Date())).rejects.toThrow(
        RpcException,
      );
    });

    it('should return unavailable when facility is not available', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce({
        ...mockFacility,
        available: false,
      });
      const result = await service.getAvailability(1, new Date(2024, 5, 17));
      expect(result.isAvailable).toBe(false);
      expect(result.availableSlots).toEqual([]);
    });

    it('should return unavailable when status is not AVAILABLE', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce({
        ...mockFacility,
        status: FacilityStatus.MAINTENANCE,
      });
      const result = await service.getAvailability(1, new Date(2024, 5, 17));
      expect(result.isAvailable).toBe(false);
    });

    it('should return unavailable on non-available day', async () => {
      const tuesday = new Date(2024, 5, 18);
      mockFacilityRepository.findOne.mockResolvedValueOnce({
        ...mockFacility,
        availableDays: [0],
      });
      const result = await service.getAvailability(1, tuesday);
      expect(result.isAvailable).toBe(false);
    });

    it('should mark slots as unavailable when booked', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockBookingRepository.find.mockResolvedValueOnce([
        {
          startTime: '10:00',
          endTime: '12:00',
          status: RecreationalBookingStatus.CONFIRMED,
        },
      ]);
      const result = await service.getAvailability(1, new Date(2024, 5, 17));
      const bookedSlot = result.availableSlots.find(
        (s) => s.startTime === '10:00',
      );
      expect(bookedSlot).toBeDefined();
      if (bookedSlot) {
        expect(bookedSlot.isAvailable).toBe(false);
        expect(bookedSlot.reason).toBe('Already booked');
      }
    });

    it('should handle facility with null availableDays', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce({
        ...mockFacility,
        availableDays: null,
      });
      mockBookingRepository.find.mockResolvedValueOnce([]);
      const result = await service.getAvailability(1, new Date(2024, 5, 17));
      expect(result.availableSlots.length).toBeGreaterThan(0);
    });
  });

  describe('getMultipleAvailability', () => {
    it('should return availability for multiple facilities', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockBookingRepository.find.mockResolvedValueOnce([]);
      mockFacilityRepository.findOne.mockResolvedValueOnce({
        ...mockFacility,
        id: 2,
        name: 'Gym',
      });
      mockBookingRepository.find.mockResolvedValueOnce([]);
      const result = await service.getMultipleAvailability(
        [1, 2],
        new Date(2024, 5, 17),
      );
      expect(result.length).toBe(2);
    });

    it('should filter out failed availability lookups', async () => {
      mockFacilityRepository.findOne.mockResolvedValueOnce(mockFacility);
      mockBookingRepository.find.mockResolvedValueOnce([]);
      mockFacilityRepository.findOne.mockResolvedValueOnce(null);
      const result = await service.getMultipleAvailability(
        [1, 999],
        new Date(2024, 5, 17),
      );
      expect(result.length).toBe(1);
    });
  });
});
