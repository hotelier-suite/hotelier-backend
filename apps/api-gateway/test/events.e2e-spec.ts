import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { EventsServiceModule } from '../src/events-service/events-service.module';
import { EVENTS_SERVICE_CLIENT } from '../src/events-service/constants';

describe('Events Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [EventsServiceModule],
    })
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

  // ─── Events ───────────────────────────────────────────────────────────

  describe('POST /api/events', () => {
    it('should create an event', () => {
      const mockEvent = { id: 1, title: 'Corporate Retreat' };
      mockClient.send.mockReturnValue(of(mockEvent));

      return request(app.getHttpServer())
        .post('/api/events')
        .send({
          title: 'Corporate Retreat',
          eventDate: '2025-12-15T00:00:00.000Z',
          startTime: '09:00',
          venue: 'Conference Room Alpha',
          capacity: 50,
          organizer: 'TechCorp Inc.',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockEvent);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/events')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/events', () => {
    it('should return all events', () => {
      const mockEvents = [{ id: 1, title: 'Corporate Retreat' }];
      mockClient.send.mockReturnValue(of(mockEvents));

      return request(app.getHttpServer())
        .get('/api/events')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockEvents);
        });
    });
  });

  describe('GET /api/events/:id', () => {
    it('should return an event by id', () => {
      const mockEvent = { id: 1, title: 'Corporate Retreat' };
      mockClient.send.mockReturnValue(of(mockEvent));

      return request(app.getHttpServer())
        .get('/api/events/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockEvent);
        });
    });
  });

  describe('PATCH /api/events/:id', () => {
    it('should update an event', () => {
      mockClient.send.mockReturnValue(of({ id: 1, title: 'Updated Event' }));

      return request(app.getHttpServer())
        .patch('/api/events/1')
        .send({ title: 'Updated Event' })
        .expect(200);
    });
  });

  describe('DELETE /api/events/:id', () => {
    it('should delete an event', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer()).delete('/api/events/1').expect(200);
    });
  });

  // ─── Venues ───────────────────────────────────────────────────────────

  describe('POST /api/venues', () => {
    it('should create a venue', () => {
      const mockVenue = { id: 1, name: 'Grand Ballroom' };
      mockClient.send.mockReturnValue(of(mockVenue));

      return request(app.getHttpServer())
        .post('/api/venues')
        .send({
          name: 'Grand Ballroom',
          capacity: 200,
          area: 400.5,
          hourlyRate: 500.0,
          location: 'Main Building - Ground Floor',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockVenue);
        });
    });
  });

  describe('GET /api/venues', () => {
    it('should return all venues', () => {
      const mockVenues = [{ id: 1, name: 'Grand Ballroom' }];
      mockClient.send.mockReturnValue(of(mockVenues));

      return request(app.getHttpServer())
        .get('/api/venues')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockVenues);
        });
    });
  });

  describe('GET /api/venues/:id', () => {
    it('should return a venue by id', () => {
      const mockVenue = { id: 1, name: 'Grand Ballroom' };
      mockClient.send.mockReturnValue(of(mockVenue));

      return request(app.getHttpServer())
        .get('/api/venues/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockVenue);
        });
    });
  });

  describe('PATCH /api/venues/:id', () => {
    it('should update a venue', () => {
      mockClient.send.mockReturnValue(of({ id: 1, capacity: 300 }));

      return request(app.getHttpServer())
        .patch('/api/venues/1')
        .send({ capacity: 300 })
        .expect(200);
    });
  });

  describe('DELETE /api/venues/:id', () => {
    it('should delete a venue', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer()).delete('/api/venues/1').expect(200);
    });
  });

  // ─── Event Bookings ───────────────────────────────────────────────────

  describe('POST /api/event-bookings', () => {
    it('should create an event booking', () => {
      const mockBooking = { id: 1, title: 'Smith Family Reunion' };
      mockClient.send.mockReturnValue(of(mockBooking));

      return request(app.getHttpServer())
        .post('/api/event-bookings')
        .send({
          title: 'Smith Family Reunion',
          eventDate: '2025-12-14T00:00:00.000Z',
          startTime: '11:00',
          endTime: '16:00',
          attendees: 80,
          clientName: 'James Smith',
          clientEmail: 'james@email.com',
          venueId: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockBooking);
        });
    });
  });

  describe('GET /api/event-bookings', () => {
    it('should return all event bookings', () => {
      const mockBookings = [{ id: 1, title: 'Smith Family Reunion' }];
      mockClient.send.mockReturnValue(of(mockBookings));

      return request(app.getHttpServer())
        .get('/api/event-bookings')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockBookings);
        });
    });
  });

  describe('GET /api/event-bookings/:id', () => {
    it('should return an event booking by id', () => {
      const mockBooking = { id: 1, title: 'Smith Family Reunion' };
      mockClient.send.mockReturnValue(of(mockBooking));

      return request(app.getHttpServer())
        .get('/api/event-bookings/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockBooking);
        });
    });
  });

  describe('PATCH /api/event-bookings/:id', () => {
    it('should update an event booking', () => {
      mockClient.send.mockReturnValue(of({ id: 1, attendees: 100 }));

      return request(app.getHttpServer())
        .patch('/api/event-bookings/1')
        .send({ attendees: 100 })
        .expect(200);
    });
  });

  describe('DELETE /api/event-bookings/:id', () => {
    it('should delete an event booking', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/event-bookings/1')
        .expect(200);
    });
  });
});
