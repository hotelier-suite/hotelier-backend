import { Test, TestingModule } from '@nestjs/testing';
import { of, lastValueFrom } from 'rxjs';
import { ReservationsService } from './';
import { BOOKING_SERVICE_CLIENT } from '../constants';
import { BILLING_SERVICE_CLIENT } from '../../billing-service';
import { RESTAURANT_SERVICE_CLIENT } from '../../restaurant-service';
import { EVENTS_SERVICE_CLIENT } from '../../events-service';

describe('ReservationsService (gateway)', () => {
  let service: ReservationsService;
  const mockBookingClient = { send: jest.fn() };
  const mockBillingClient = { send: jest.fn() };
  const mockRestaurantClient = { send: jest.fn() };
  const mockEventsClient = { send: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: BOOKING_SERVICE_CLIENT, useValue: mockBookingClient },
        { provide: BILLING_SERVICE_CLIENT, useValue: mockBillingClient },
        { provide: RESTAURANT_SERVICE_CLIENT, useValue: mockRestaurantClient },
        { provide: EVENTS_SERVICE_CLIENT, useValue: mockEventsClient },
      ],
    }).compile();
    service = module.get<ReservationsService>(ReservationsService);
    jest.clearAllMocks();
  });

  it('should findAll', async () => {
    mockBookingClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.findAll({} as never));
    expect(result).toEqual([]);
  });

  it('should findOne', async () => {
    mockBookingClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.findOne(1));
    expect(result).toHaveProperty('id');
  });

  it('should getAvailability', async () => {
    mockBookingClient.send.mockReturnValueOnce(of([]));
    const result = await lastValueFrom(service.getAvailability({} as never));
    expect(result).toEqual([]);
  });

  it('should create', async () => {
    mockBookingClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.create({} as never));
    expect(result).toHaveProperty('id');
  });

  it('should update', async () => {
    mockBookingClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.update(1, {} as never));
    expect(result).toHaveProperty('id');
  });

  it('should remove', async () => {
    mockBookingClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.remove(1));
    expect(result).toHaveProperty('id');
  });

  it('should checkout', async () => {
    mockBookingClient.send.mockReturnValueOnce(of({ id: 1 }));
    const result = await lastValueFrom(service.checkout(1));
    expect(result).toHaveProperty('id');
  });

  it('should getReservationsWithBillingDetails', async () => {
    mockBookingClient.send.mockReturnValueOnce(
      of([
        {
          id: 1,
          status: 'CONFIRMED',
          totalAmount: 100,
          guestId: 5,
          room: { number: '101' },
        },
      ]),
    );
    mockBillingClient.send.mockReturnValueOnce(
      of([{ id: 1, reservationId: 1, status: 'PAID' }]),
    );
    mockRestaurantClient.send.mockReturnValueOnce(
      of([
        {
          id: 1,
          guestId: 5,
          room: '101',
          orderNumber: 'O-1',
          total: 50,
          status: 'DELIVERED',
          items: [],
        },
      ]),
    );
    mockEventsClient.send.mockReturnValueOnce(
      of([
        {
          id: 1,
          guestId: 5,
          title: 'Event',
          totalCost: 200,
          status: 'CONFIRMED',
          attendees: 10,
        },
      ]),
    );

    const result = await service.getReservationsWithBillingDetails();
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty('roomCharges');
    expect(result[0]).toHaveProperty('grandTotal');
    expect((result[0] as Record<string, unknown>).hasInvoice).toBe(true);
  });

  it('should handle errors in billing details', async () => {
    mockBookingClient.send.mockReturnValueOnce(
      of([{ id: 1, status: 'PENDING', totalAmount: 50, guestId: null }]),
    );
    mockBillingClient.send.mockReturnValueOnce(of([]));
    mockRestaurantClient.send.mockReturnValueOnce(of([]));
    mockEventsClient.send.mockReturnValueOnce(of([]));

    const result = await service.getReservationsWithBillingDetails();
    expect(result).toHaveLength(1);
    expect((result[0] as Record<string, unknown>).isPendingPayment).toBe(true);
  });

  it('should filter irrelevant statuses', async () => {
    mockBookingClient.send.mockReturnValueOnce(
      of([{ id: 1, status: 'CANCELLED', totalAmount: 0 }]),
    );
    mockBillingClient.send.mockReturnValueOnce(of([]));
    mockRestaurantClient.send.mockReturnValueOnce(of([]));
    mockEventsClient.send.mockReturnValueOnce(of([]));

    const result = await service.getReservationsWithBillingDetails();
    expect(result).toHaveLength(0);
  });
});
