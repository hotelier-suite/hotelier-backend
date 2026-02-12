import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { RecreationalServiceModule } from '../src/recreational-service/recreational-service.module';
import { RECREATIONAL_SERVICE_CLIENT } from '../src/recreational-service/constants';

describe('Recreational Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RecreationalServiceModule],
    })
      .overrideProvider(RECREATIONAL_SERVICE_CLIENT)
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

  // ─── Facilities ───────────────────────────────────────────────────────

  describe('POST /api/recreational/facilities', () => {
    it('should create a facility', () => {
      const mockFacility = { id: 1, name: 'Main Pool' };
      mockClient.send.mockReturnValue(of(mockFacility));

      return request(app.getHttpServer())
        .post('/api/recreational/facilities')
        .send({
          name: 'Main Pool',
          type: 'SWIMMING_POOL',
          capacity: 50,
          location: 'Ground Floor',
          available: true,
          openingTime: '06:00',
          closingTime: '22:00',
          minimumBookingHours: 1,
          maximumBookingHours: 4,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockFacility);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/recreational/facilities')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/recreational/facilities', () => {
    it('should return all facilities', () => {
      const mockFacilities = [{ id: 1, name: 'Main Pool' }];
      mockClient.send.mockReturnValue(of(mockFacilities));

      return request(app.getHttpServer())
        .get('/api/recreational/facilities')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockFacilities);
        });
    });
  });

  describe('GET /api/recreational/facilities/:id', () => {
    it('should return a facility by id', () => {
      const mockFacility = { id: 1, name: 'Main Pool' };
      mockClient.send.mockReturnValue(of(mockFacility));

      return request(app.getHttpServer())
        .get('/api/recreational/facilities/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockFacility);
        });
    });
  });

  describe('PATCH /api/recreational/facilities/:id', () => {
    it('should update a facility', () => {
      mockClient.send.mockReturnValue(of({ id: 1, capacity: 60 }));

      return request(app.getHttpServer())
        .patch('/api/recreational/facilities/1')
        .send({ capacity: 60 })
        .expect(200);
    });
  });

  describe('DELETE /api/recreational/facilities/:id', () => {
    it('should delete a facility', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/recreational/facilities/1')
        .expect(200);
    });
  });

  // ─── Bookings ─────────────────────────────────────────────────────────

  describe('POST /api/recreational/bookings', () => {
    it('should create a booking', () => {
      const mockBooking = { id: 1, guestName: 'John Smith' };
      mockClient.send.mockReturnValue(of(mockBooking));

      return request(app.getHttpServer())
        .post('/api/recreational/bookings')
        .send({
          guestName: 'John Smith',
          guestEmail: 'john@example.com',
          bookingDate: '2025-12-15T00:00:00.000Z',
          startTime: '14:00',
          endTime: '16:00',
          duration: 2,
          participants: 3,
          facilityId: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockBooking);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/recreational/bookings')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/recreational/bookings', () => {
    it('should return all bookings', () => {
      const mockBookings = [{ id: 1, guestName: 'John Smith' }];
      mockClient.send.mockReturnValue(of(mockBookings));

      return request(app.getHttpServer())
        .get('/api/recreational/bookings')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockBookings);
        });
    });
  });

  describe('GET /api/recreational/bookings/:id', () => {
    it('should return a booking by id', () => {
      const mockBooking = { id: 1, guestName: 'John Smith' };
      mockClient.send.mockReturnValue(of(mockBooking));

      return request(app.getHttpServer())
        .get('/api/recreational/bookings/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockBooking);
        });
    });
  });

  describe('PATCH /api/recreational/bookings/:id', () => {
    it('should update a booking', () => {
      mockClient.send.mockReturnValue(of({ id: 1, participants: 5 }));

      return request(app.getHttpServer())
        .patch('/api/recreational/bookings/1')
        .send({ participants: 5 })
        .expect(200);
    });
  });

  describe('DELETE /api/recreational/bookings/:id', () => {
    it('should delete a booking', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/recreational/bookings/1')
        .expect(200);
    });
  });
});
