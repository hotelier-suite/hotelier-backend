import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { StatisticsModule } from './statistics.module';
import { StatisticsService } from './statistics.service';

/**
 * Dashboard StatisticsService is a pure aggregation module with no database
 * entities — it calls 6 external microservices via RabbitMQ.  The integration
 * test verifies that the module bootstraps correctly and the aggregation logic
 * works end-to-end with mocked RabbitMQ client responses.
 */

const mockBookingClient = {
  send: jest.fn().mockReturnValue(
    of([
      {
        id: 1,
        number: '101',
        type: 'standard',
        floor: 1,
        pricePerNight: 100,
        isAvailable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        number: '102',
        type: 'deluxe',
        floor: 1,
        pricePerNight: 200,
        isAvailable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]),
  ),
  emit: jest.fn(),
};

const mockBillingClient = {
  send: jest.fn().mockReturnValue(of({ totalRevenue: 50000 })),
  emit: jest.fn(),
};

const mockOperationsClient = {
  send: jest.fn().mockReturnValue(of([])),
  emit: jest.fn(),
};

const mockGuestRequestsClient = {
  send: jest.fn().mockReturnValue(of(3)),
  emit: jest.fn(),
};

const mockStaffClient = {
  send: jest
    .fn()
    .mockReturnValue(
      of([{ department: 'Housekeeping', totalCount: 10, activeCount: 8 }]),
    ),
  emit: jest.fn(),
};

const mockAuthClient = {
  send: jest.fn().mockReturnValue(of({ id: 1 })),
  emit: jest.fn(),
};

describe('StatisticsService (integration)', () => {
  let module: TestingModule;
  let service: StatisticsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [StatisticsModule],
    })
      .overrideProvider('BOOKING_SERVICE')
      .useValue(mockBookingClient)
      .overrideProvider('BILLING_SERVICE')
      .useValue(mockBillingClient)
      .overrideProvider('OPERATIONS_SERVICE')
      .useValue(mockOperationsClient)
      .overrideProvider('GUEST_REQUESTS_SERVICE')
      .useValue(mockGuestRequestsClient)
      .overrideProvider('STAFF_SERVICE')
      .useValue(mockStaffClient)
      .overrideProvider('AUTH_SERVICE')
      .useValue(mockAuthClient)
      .compile();

    service = module.get(StatisticsService);
  });

  afterAll(async () => {
    await module.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Re-set default mock implementations after clearAllMocks
    mockBookingClient.send.mockReturnValue(
      of([
        {
          id: 1,
          number: '101',
          type: 'standard',
          floor: 1,
          pricePerNight: 100,
          isAvailable: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          number: '102',
          type: 'deluxe',
          floor: 1,
          pricePerNight: 200,
          isAvailable: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]),
    );
    mockBillingClient.send.mockReturnValue(of({ totalRevenue: 50000 }));
    mockOperationsClient.send.mockReturnValue(of([]));
    mockGuestRequestsClient.send.mockReturnValue(of(3));
    mockStaffClient.send.mockReturnValue(
      of([{ department: 'Housekeeping', totalCount: 10, activeCount: 8 }]),
    );
    mockAuthClient.send.mockReturnValue(of({ id: 1 }));
  });

  it('should get dashboard stats', async () => {
    const stats = await service.getStats(1);

    expect(stats).toBeDefined();
    expect(stats.totalRooms).toBe(2);
    expect(stats.availableRooms).toBe(1);
    expect(stats.occupiedRooms).toBe(1);
    expect(stats.totalRevenue).toBe(50000);
    expect(stats.activeStaff).toBe(8);
    expect(stats.pendingRequests).toBe(3);
  });

  it('should throw when user not found in getStats', async () => {
    mockAuthClient.send.mockReturnValue(of(null));

    await expect(service.getStats(999)).rejects.toThrow();
  });

  it('should get occupancy data', async () => {
    const data = await service.getOccupancy();

    expect(data).toBeDefined();
    expect(data).toHaveLength(7);
    data.forEach((d) => {
      expect(d.date).toBeDefined();
      expect(typeof d.occupancy).toBe('number');
      expect(d.occupancy).toBeGreaterThanOrEqual(0);
      expect(d.occupancy).toBeLessThanOrEqual(100);
    });
  });

  it('should return zero occupancy when no rooms exist', async () => {
    mockBookingClient.send.mockReturnValue(of([]));

    const data = await service.getOccupancy();
    expect(data).toHaveLength(7);
    data.forEach((d) => expect(d.occupancy).toBe(0));
  });

  it('should get revenue data', async () => {
    mockBillingClient.send.mockReturnValue(of([]));

    const data = await service.getRevenue(1);

    expect(data).toBeDefined();
    expect(data).toHaveLength(7);
    data.forEach((d) => {
      expect(d.date).toBeDefined();
      expect(typeof d.revenue).toBe('number');
    });
  });

  it('should throw when user not found in getRevenue', async () => {
    mockAuthClient.send.mockReturnValue(of(null));

    await expect(service.getRevenue(999)).rejects.toThrow();
  });

  it('should get top performing rooms', async () => {
    mockBookingClient.send.mockReturnValue(
      of([
        {
          id: 1,
          roomId: 1,
          room: { number: '101' },
          totalAmount: 500,
          nights: 5,
          createdAt: new Date(),
          guestName: 'Guest A',
        },
      ]),
    );

    const rooms = await service.getTopRooms();
    expect(rooms).toBeDefined();
    expect(Array.isArray(rooms)).toBe(true);
  });

  it('should get recent activities', async () => {
    mockBookingClient.send.mockReturnValue(
      of([
        {
          id: 1,
          roomId: 1,
          guestName: 'John Doe',
          createdAt: new Date(),
        },
      ]),
    );
    mockBillingClient.send.mockReturnValue(
      of([
        {
          id: 1,
          number: 'INV-001',
          createdAt: new Date(),
        },
      ]),
    );
    mockOperationsClient.send.mockReturnValue(
      of([
        {
          id: 1,
          assignedDate: new Date(),
          completedAt: null,
        },
      ]),
    );
    mockGuestRequestsClient.send.mockReturnValue(
      of([
        {
          id: 1,
          type: 'towels',
          room: '101',
          createdAt: new Date(),
        },
      ]),
    );

    const activities = await service.getRecentActivities(1);
    expect(activities).toBeDefined();
    expect(Array.isArray(activities)).toBe(true);
    expect(activities.length).toBeGreaterThanOrEqual(1);
  });

  it('should throw when user not found in getRecentActivities', async () => {
    mockAuthClient.send.mockReturnValue(of(null));

    await expect(service.getRecentActivities(999)).rejects.toThrow();
  });
});
