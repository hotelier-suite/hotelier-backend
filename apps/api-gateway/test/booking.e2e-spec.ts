import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { BookingServiceModule } from '../src/booking-service/booking-service.module';
import { BOOKING_SERVICE_CLIENT } from '../src/booking-service/constants';
import { BillingServiceModule } from '../src/billing-service/billing-service.module';
import { BILLING_SERVICE_CLIENT } from '../src/billing-service/constants';
import { RestaurantServiceModule } from '../src/restaurant-service/restaurant-service.module';
import { RESTAURANT_SERVICE_CLIENT } from '../src/restaurant-service/constants';
import { EventsServiceModule } from '../src/events-service/events-service.module';
import { EVENTS_SERVICE_CLIENT } from '../src/events-service/constants';

describe('Booking Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    // ReservationsService has cross-module deps on billing, restaurant, events
    const moduleRef = await Test.createTestingModule({
      imports: [
        BookingServiceModule,
        BillingServiceModule,
        RestaurantServiceModule,
        EventsServiceModule,
      ],
    })
      .overrideProvider(BOOKING_SERVICE_CLIENT)
      .useValue(mockClient)
      .overrideProvider(BILLING_SERVICE_CLIENT)
      .useValue(mockClient)
      .overrideProvider(RESTAURANT_SERVICE_CLIENT)
      .useValue(mockClient)
      .overrideProvider(EVENTS_SERVICE_CLIENT)
      .useValue(mockClient)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Rooms ────────────────────────────────────────────────────────────

  describe('POST /api/rooms', () => {
    it('should create a room', () => {
      const mockRoom = { id: 1, number: '101', type: 'INDIVIDUAL' };
      mockClient.send.mockReturnValue(of(mockRoom));

      return request(app.getHttpServer())
        .post('/api/rooms')
        .send({
          number: '101',
          type: 'INDIVIDUAL',
          price: 100,
          capacity: 2,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockRoom);
          expect(mockClient.send).toHaveBeenCalled();
        });
    });
  });

  describe('GET /api/rooms', () => {
    it('should return all rooms', () => {
      const mockRooms = [
        { id: 1, roomNumber: '101' },
        { id: 2, roomNumber: '102' },
      ];
      mockClient.send.mockReturnValue(of(mockRooms));

      return request(app.getHttpServer())
        .get('/api/rooms')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRooms);
        });
    });

    it('should pass query filters', () => {
      mockClient.send.mockReturnValue(of([]));

      return request(app.getHttpServer())
        .get('/api/rooms?type=INDIVIDUAL')
        .expect(200)
        .expect(() => {
          expect(mockClient.send).toHaveBeenCalled();
        });
    });
  });

  describe('GET /api/rooms/:id', () => {
    it('should return a room by id', () => {
      const mockRoom = { id: 1, roomNumber: '101' };
      mockClient.send.mockReturnValue(of(mockRoom));

      return request(app.getHttpServer())
        .get('/api/rooms/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRoom);
        });
    });

    it('should return 400 for non-numeric id', () => {
      return request(app.getHttpServer()).get('/api/rooms/abc').expect(400);
    });
  });

  describe('PATCH /api/rooms/:id', () => {
    it('should update a room', () => {
      const mockRoom = { id: 1, basePrice: 150 };
      mockClient.send.mockReturnValue(of(mockRoom));

      return request(app.getHttpServer())
        .patch('/api/rooms/1')
        .send({ basePrice: 150 })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRoom);
        });
    });
  });

  describe('DELETE /api/rooms/:id', () => {
    it('should delete a room', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer()).delete('/api/rooms/1').expect(200);
    });
  });

  // ─── Guests ───────────────────────────────────────────────────────────

  describe('GET /api/guests', () => {
    it('should return all guests', () => {
      const mockGuests = [{ id: 1, firstName: 'John', lastName: 'Doe' }];
      mockClient.send.mockReturnValue(of(mockGuests));

      return request(app.getHttpServer())
        .get('/api/guests')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockGuests);
        });
    });
  });

  describe('GET /api/guests/:id', () => {
    it('should return a guest by id', () => {
      const mockGuest = { id: 1, firstName: 'John' };
      mockClient.send.mockReturnValue(of(mockGuest));

      return request(app.getHttpServer())
        .get('/api/guests/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockGuest);
        });
    });
  });

  describe('POST /api/guests', () => {
    it('should create a guest', () => {
      const mockGuest = { id: 1, name: 'John Doe', email: 'john@example.com' };
      mockClient.send.mockReturnValue(of(mockGuest));

      return request(app.getHttpServer())
        .post('/api/guests')
        .send({ name: 'John Doe', email: 'john@example.com', vip: false })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockGuest);
        });
    });
  });

  describe('PATCH /api/guests/:id', () => {
    it('should update a guest', () => {
      mockClient.send.mockReturnValue(of({ id: 1, firstName: 'Updated' }));

      return request(app.getHttpServer())
        .patch('/api/guests/1')
        .send({ firstName: 'Updated' })
        .expect(200);
    });
  });

  describe('DELETE /api/guests/:id', () => {
    it('should delete a guest', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer()).delete('/api/guests/1').expect(200);
    });
  });

  // ─── Reservations ────────────────────────────────────────────────────

  describe('POST /api/reservations', () => {
    it('should create a reservation', () => {
      const mockReservation = { id: 1, status: 'CONFIRMED' };
      mockClient.send.mockReturnValue(of(mockReservation));

      return request(app.getHttpServer())
        .post('/api/reservations')
        .send({
          guestName: 'John Doe',
          guestEmail: 'john@example.com',
          roomId: 1,
          guests: 2,
          checkInDate: '2025-01-01T00:00:00.000Z',
          checkOutDate: '2025-01-05T00:00:00.000Z',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockReservation);
        });
    });
  });

  describe('GET /api/reservations', () => {
    it('should return all reservations', () => {
      const mockReservations = [{ id: 1, status: 'CONFIRMED' }];
      mockClient.send.mockReturnValue(of(mockReservations));

      return request(app.getHttpServer())
        .get('/api/reservations')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockReservations);
        });
    });
  });

  describe('GET /api/reservations/:id', () => {
    it('should return a reservation by id', () => {
      const mockReservation = { id: 1, status: 'CONFIRMED' };
      mockClient.send.mockReturnValue(of(mockReservation));

      return request(app.getHttpServer())
        .get('/api/reservations/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockReservation);
        });
    });
  });

  describe('PATCH /api/reservations/:id', () => {
    it('should update a reservation', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'CHECKED_IN' }));

      return request(app.getHttpServer())
        .patch('/api/reservations/1')
        .send({ status: 'CHECKED_IN' })
        .expect(200);
    });
  });

  describe('PATCH /api/reservations/:id/checkout', () => {
    it('should checkout a reservation', () => {
      const mockReservation = { id: 1, status: 'CHECKED_OUT' };
      mockClient.send.mockReturnValue(of(mockReservation));

      return request(app.getHttpServer())
        .patch('/api/reservations/1/checkout')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockReservation);
        });
    });
  });

  describe('DELETE /api/reservations/:id', () => {
    it('should cancel a reservation', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/reservations/1')
        .expect(200);
    });
  });

  describe('GET /api/reservations/availability', () => {
    it('should check availability', () => {
      const mockRooms = [{ id: 1, number: '101', type: 'INDIVIDUAL' }];
      mockClient.send.mockReturnValue(of(mockRooms));

      return request(app.getHttpServer())
        .get(
          '/api/reservations/availability?startDate=2025-01-01&endDate=2025-01-31',
        )
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRooms);
        });
    });
  });

  describe('GET /api/reservations/billing-details', () => {
    it('should return billing details', () => {
      // This is a complex aggregation endpoint using multiple clients;
      // the default empty mock responses produce an empty result set
      mockClient.send.mockReturnValue(of([]));

      return request(app.getHttpServer())
        .get('/api/reservations/billing-details')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
