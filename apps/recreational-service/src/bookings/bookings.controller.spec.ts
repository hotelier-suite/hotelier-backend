import { Test, TestingModule } from '@nestjs/testing';
import { BookingsController, BookingsService } from './';
import {
  RecreationalBookingDto,
  CreateRecreationalBookingDto,
  UpdateRecreationalBookingDto,
  RecreationalBookingStatus,
  BookingPriority,
  BookingStatisticsDto,
  FindRecreationalBookingsFilterDto,
} from '@app/contracts/recreational-service';

describe('BookingsController', () => {
  let controller: BookingsController;
  let service: BookingsService;

  const mockBooking: RecreationalBookingDto = {
    id: 1,
    facilityId: 1,
    guestName: 'John Doe',
    guestEmail: 'john@example.com',
    bookingDate: new Date('2024-06-15'),
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    participants: 3,
    totalCost: 30,
    status: RecreationalBookingStatus.CONFIRMED,
    priority: BookingPriority.NORMAL,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    cancel: jest.fn(),
    checkIn: jest.fn(),
    checkOut: jest.fn(),
    getStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookingsController],
      providers: [{ provide: BookingsService, useValue: mockService }],
    }).compile();

    controller = module.get<BookingsController>(BookingsController);
    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all bookings', async () => {
      const filters: FindRecreationalBookingsFilterDto = {};
      const spy = jest
        .spyOn(service, 'findAll')
        .mockResolvedValueOnce([mockBooking]);
      const result = await controller.findAll(filters);
      expect(spy).toHaveBeenCalledWith(filters);
      expect(result).toEqual([mockBooking]);
    });
  });

  describe('findOne', () => {
    it('should return a booking by id', async () => {
      const spy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValueOnce(mockBooking);
      const result = await controller.findOne(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('create', () => {
    it('should create a booking', async () => {
      const dto: CreateRecreationalBookingDto = {
        facilityId: 1,
        guestName: 'John Doe',
        guestEmail: 'john@example.com',
        bookingDate: new Date('2024-06-15'),
        startTime: '10:00',
        endTime: '12:00',
        duration: 2,
        participants: 3,
      };
      const spy = jest
        .spyOn(service, 'create')
        .mockResolvedValueOnce(mockBooking);
      const result = await controller.create(dto);
      expect(spy).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('update', () => {
    it('should update a booking', async () => {
      const data: UpdateRecreationalBookingDto = { participants: 5 };
      const updated = { ...mockBooking, participants: 5 };
      const spy = jest.spyOn(service, 'update').mockResolvedValueOnce(updated);
      const result = await controller.update({ id: 1, data });
      expect(spy).toHaveBeenCalledWith(1, data);
      expect(result.participants).toBe(5);
    });
  });

  describe('remove', () => {
    it('should remove a booking', async () => {
      const spy = jest
        .spyOn(service, 'remove')
        .mockResolvedValueOnce(mockBooking);
      const result = await controller.remove(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockBooking);
    });
  });

  describe('cancel', () => {
    it('should cancel a booking', async () => {
      const cancelled = {
        ...mockBooking,
        status: RecreationalBookingStatus.CANCELLED,
      };
      const spy = jest
        .spyOn(service, 'cancel')
        .mockResolvedValueOnce(cancelled);
      const result = await controller.cancel({
        id: 1,
        reason: 'Guest request',
      });
      expect(spy).toHaveBeenCalledWith(1, 'Guest request');
      expect(result.status).toBe(RecreationalBookingStatus.CANCELLED);
    });
  });

  describe('checkIn', () => {
    it('should check in a booking', async () => {
      const checkedIn = {
        ...mockBooking,
        status: RecreationalBookingStatus.CHECKED_IN,
      };
      const spy = jest
        .spyOn(service, 'checkIn')
        .mockResolvedValueOnce(checkedIn);
      const result = await controller.checkIn(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result.status).toBe(RecreationalBookingStatus.CHECKED_IN);
    });
  });

  describe('checkOut', () => {
    it('should check out a booking', async () => {
      const completed = {
        ...mockBooking,
        status: RecreationalBookingStatus.COMPLETED,
      };
      const spy = jest
        .spyOn(service, 'checkOut')
        .mockResolvedValueOnce(completed);
      const result = await controller.checkOut(1);
      expect(spy).toHaveBeenCalledWith(1);
      expect(result.status).toBe(RecreationalBookingStatus.COMPLETED);
    });
  });

  describe('getStatistics', () => {
    it('should return booking statistics', async () => {
      const stats: BookingStatisticsDto = {
        totalBookings: 10,
        totalRevenue: 500,
        averageBookingValue: 50,
        mostPopularFacilityType: 'SWIMMING_POOL',
        peakHour: '10:00',
        facilitiesUsage: [],
        statusBreakdown: {},
        period: { startDate: new Date(), endDate: new Date() },
      };
      const spy = jest
        .spyOn(service, 'getStatistics')
        .mockResolvedValueOnce(stats);
      const payload = {
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
      };
      const result = await controller.getStatistics(payload);
      expect(spy).toHaveBeenCalledWith(payload.startDate, payload.endDate);
      expect(result).toEqual(stats);
    });
  });
});
