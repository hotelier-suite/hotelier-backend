import { Test, TestingModule } from '@nestjs/testing';
import { RpcException } from '@nestjs/microservices';
import { of, throwError } from 'rxjs';
import { StatisticsService } from './';

describe('StatisticsService', () => {
  let service: StatisticsService;

  const mockBookingClient = { send: jest.fn() };
  const mockBillingClient = { send: jest.fn() };
  const mockOperationsClient = { send: jest.fn() };
  const mockGuestRequestsClient = { send: jest.fn() };
  const mockStaffClient = { send: jest.fn() };
  const mockAuthClient = { send: jest.fn() };

  const today = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        { provide: 'BOOKING_SERVICE', useValue: mockBookingClient },
        { provide: 'BILLING_SERVICE', useValue: mockBillingClient },
        { provide: 'OPERATIONS_SERVICE', useValue: mockOperationsClient },
        {
          provide: 'GUEST_REQUESTS_SERVICE',
          useValue: mockGuestRequestsClient,
        },
        { provide: 'STAFF_SERVICE', useValue: mockStaffClient },
        { provide: 'AUTH_SERVICE', useValue: mockAuthClient },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should return dashboard statistics', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBookingClient.send
        .mockReturnValueOnce(
          of([
            { id: 1, isAvailable: true },
            { id: 2, isAvailable: false },
            { id: 3, isAvailable: true },
          ]),
        )
        .mockReturnValueOnce(
          of([
            {
              id: 1,
              checkInDate: today.toISOString(),
              checkOutDate: new Date(today.getTime() + 86400000).toISOString(),
              roomId: 1,
              guestName: 'John',
            },
          ]),
        );
      mockBillingClient.send.mockReturnValueOnce(of({ totalRevenue: 50000 }));
      mockStaffClient.send.mockReturnValueOnce(
        of([{ activeCount: 10 }, { activeCount: 15 }]),
      );
      mockGuestRequestsClient.send.mockReturnValueOnce(of(5));
      const result = await service.getStats(1);
      expect(result.totalRooms).toBe(3);
      expect(result.availableRooms).toBe(2);
      expect(result.occupiedRooms).toBe(1);
      expect(result.totalRevenue).toBe(50000);
      expect(result.pendingRequests).toBe(5);
      expect(result.activeStaff).toBe(25);
    });

    it('should throw when user not found', async () => {
      mockAuthClient.send.mockReturnValueOnce(of(null));
      await expect(service.getStats(999)).rejects.toThrow(RpcException);
    });

    it('should handle service errors gracefully', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBookingClient.send
        .mockReturnValueOnce(throwError(() => new Error('fail')))
        .mockReturnValueOnce(throwError(() => new Error('fail')));
      mockBillingClient.send.mockReturnValueOnce(
        throwError(() => new Error('fail')),
      );
      mockStaffClient.send.mockReturnValueOnce(
        throwError(() => new Error('fail')),
      );
      mockGuestRequestsClient.send.mockReturnValueOnce(
        throwError(() => new Error('fail')),
      );
      const result = await service.getStats(1);
      expect(result.totalRooms).toBe(0);
      expect(result.totalRevenue).toBe(0);
      expect(result.pendingRequests).toBe(0);
      expect(result.activeStaff).toBe(0);
    });

    it('should handle non-array departmentStats', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBookingClient.send
        .mockReturnValueOnce(of([]))
        .mockReturnValueOnce(of([]));
      mockBillingClient.send.mockReturnValueOnce(of({ totalRevenue: 0 }));
      mockStaffClient.send.mockReturnValueOnce(of('not-an-array'));
      mockGuestRequestsClient.send.mockReturnValueOnce(of(0));
      const result = await service.getStats(1);
      expect(result.activeStaff).toBe(0);
    });

    it('should handle non-number pendingRequests', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBookingClient.send
        .mockReturnValueOnce(of([]))
        .mockReturnValueOnce(of([]));
      mockBillingClient.send.mockReturnValueOnce(of({ totalRevenue: 0 }));
      mockStaffClient.send.mockReturnValueOnce(of([]));
      mockGuestRequestsClient.send.mockReturnValueOnce(of('invalid'));
      const result = await service.getStats(1);
      expect(result.pendingRequests).toBe(0);
    });
  });

  describe('getOccupancy', () => {
    it('should return 7 days of occupancy data', async () => {
      mockBookingClient.send
        .mockReturnValueOnce(of([{ id: 1 }, { id: 2 }]))
        .mockReturnValueOnce(
          of([
            {
              checkInDate: new Date(today.getTime() - 86400000).toISOString(),
              checkOutDate: new Date(today.getTime() + 86400000).toISOString(),
            },
          ]),
        );
      const result = await service.getOccupancy();
      expect(result.length).toBe(7);
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('occupancy');
    });

    it('should return zero occupancy when no rooms', async () => {
      mockBookingClient.send
        .mockReturnValueOnce(of([]))
        .mockReturnValueOnce(of([]));
      const result = await service.getOccupancy();
      expect(result.length).toBe(7);
      result.forEach((d) => expect(d.occupancy).toBe(0));
    });
  });

  describe('getRevenue', () => {
    it('should return 7 days of revenue data', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBillingClient.send.mockReturnValueOnce(
        of([
          { createdAt: today.toISOString(), total: 1000, number: 'INV-001' },
        ]),
      );
      const result = await service.getRevenue(1);
      expect(result.length).toBe(7);
    });

    it('should throw when user not found', async () => {
      mockAuthClient.send.mockReturnValueOnce(of(null));
      await expect(service.getRevenue(999)).rejects.toThrow(RpcException);
    });

    it('should handle error fetching invoices', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBillingClient.send.mockReturnValueOnce(
        throwError(() => new Error('fail')),
      );
      const result = await service.getRevenue(1);
      expect(result.length).toBe(7);
      result.forEach((d) => expect(d.revenue).toBe(0));
    });
  });

  describe('getTopRooms', () => {
    it('should return top performing rooms', async () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 5);
      mockBookingClient.send.mockReturnValueOnce(
        of([
          {
            roomId: 1,
            room: { number: '101' },
            totalAmount: 500,
            nights: 3,
            createdAt: recentDate.toISOString(),
          },
          {
            roomId: 1,
            room: { number: '101' },
            totalAmount: 300,
            nights: 2,
            createdAt: recentDate.toISOString(),
          },
          {
            roomId: 2,
            room: { number: '102' },
            totalAmount: 200,
            nights: 1,
            createdAt: recentDate.toISOString(),
          },
        ]),
      );
      const result = await service.getTopRooms();
      expect(result.length).toBe(2);
      expect(result[0].room).toBe('101');
      expect(result[0].revenue).toBe(800);
    });

    it('should handle empty reservations', async () => {
      mockBookingClient.send.mockReturnValueOnce(of([]));
      const result = await service.getTopRooms();
      expect(result).toEqual([]);
    });

    it('should handle missing room property', async () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 5);
      mockBookingClient.send.mockReturnValueOnce(
        of([
          {
            roomId: 1,
            totalAmount: 500,
            nights: 3,
            createdAt: recentDate.toISOString(),
          },
        ]),
      );
      const result = await service.getTopRooms();
      expect(result.length).toBe(1);
      expect(result[0].room).toBe('1');
    });
  });

  describe('getRecentActivities', () => {
    it('should return recent activities', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBookingClient.send.mockReturnValueOnce(
        of([{ roomId: 1, guestName: 'John', createdAt: today.toISOString() }]),
      );
      mockBillingClient.send.mockReturnValueOnce(
        of([{ number: 'INV-001', createdAt: today.toISOString() }]),
      );
      mockOperationsClient.send.mockReturnValueOnce(
        of([
          {
            id: 1,
            completedAt: today.toISOString(),
            assignedDate: today.toISOString(),
          },
        ]),
      );
      mockGuestRequestsClient.send.mockReturnValueOnce(
        of([{ type: 'towels', room: '301', createdAt: today.toISOString() }]),
      );
      const result = await service.getRecentActivities(1);
      expect(result.length).toBe(4);
    });

    it('should throw when user not found', async () => {
      mockAuthClient.send.mockReturnValueOnce(of(null));
      await expect(service.getRecentActivities(999)).rejects.toThrow(
        RpcException,
      );
    });

    it('should handle cleaning without completedAt', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBookingClient.send.mockReturnValueOnce(of([]));
      mockBillingClient.send.mockReturnValueOnce(of([]));
      mockOperationsClient.send.mockReturnValueOnce(
        of([{ id: 1, completedAt: null, assignedDate: today.toISOString() }]),
      );
      mockGuestRequestsClient.send.mockReturnValueOnce(of([]));
      const result = await service.getRecentActivities(1);
      expect(result.length).toBe(1);
      expect(result[0].type).toBe('maintenance');
    });

    it('should handle errors in all services', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      mockBookingClient.send.mockReturnValueOnce(throwError(() => new Error()));
      mockBillingClient.send.mockReturnValueOnce(throwError(() => new Error()));
      mockOperationsClient.send.mockReturnValueOnce(
        throwError(() => new Error()),
      );
      mockGuestRequestsClient.send.mockReturnValueOnce(
        throwError(() => new Error()),
      );
      const result = await service.getRecentActivities(1);
      expect(result).toEqual([]);
    });

    it('should limit results to 12', async () => {
      mockAuthClient.send.mockReturnValueOnce(of({ id: 1 }));
      const manyReservations = Array.from({ length: 20 }).map((_, i) => ({
        roomId: i,
        guestName: `Guest ${i}`,
        createdAt: new Date(today.getTime() - i * 3600000).toISOString(),
      }));
      mockBookingClient.send.mockReturnValueOnce(of(manyReservations));
      mockBillingClient.send.mockReturnValueOnce(of([]));
      mockOperationsClient.send.mockReturnValueOnce(of([]));
      mockGuestRequestsClient.send.mockReturnValueOnce(of([]));
      const result = await service.getRecentActivities(1);
      expect(result.length).toBeLessThanOrEqual(12);
    });
  });
});
