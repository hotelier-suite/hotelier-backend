import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { GuestRequestsServiceModule } from '../src/guest-requests-service/guest-requests-service.module';
import { GUEST_REQUESTS_SERVICE_CLIENT } from '../src/guest-requests-service/constants';

describe('Guest Requests Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [GuestRequestsServiceModule],
    })
      .overrideProvider(GUEST_REQUESTS_SERVICE_CLIENT)
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

  describe('POST /api/guest-requests', () => {
    it('should create a guest request', () => {
      const mockRequest = { id: 1, guestName: 'Sarah Johnson' };
      mockClient.send.mockReturnValue(of(mockRequest));

      return request(app.getHttpServer())
        .post('/api/guest-requests')
        .send({
          room: '301',
          guestName: 'Sarah Johnson',
          type: 'TOWELS',
          description: 'Extra bath towels for family of 4',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockRequest);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/guest-requests')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/guest-requests', () => {
    it('should return all guest requests', () => {
      const mockRequests = [{ id: 1, guestName: 'Sarah Johnson' }];
      mockClient.send.mockReturnValue(of(mockRequests));

      return request(app.getHttpServer())
        .get('/api/guest-requests')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRequests);
        });
    });
  });

  describe('GET /api/guest-requests/:id', () => {
    it('should return a guest request by id', () => {
      const mockRequest = { id: 1, guestName: 'Sarah Johnson' };
      mockClient.send.mockReturnValue(of(mockRequest));

      return request(app.getHttpServer())
        .get('/api/guest-requests/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRequest);
        });
    });
  });

  describe('PATCH /api/guest-requests/:id', () => {
    it('should update a guest request', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'IN_PROGRESS' }));

      return request(app.getHttpServer())
        .patch('/api/guest-requests/1')
        .send({ status: 'IN_PROGRESS' })
        .expect(200);
    });
  });

  describe('DELETE /api/guest-requests/:id', () => {
    it('should delete a guest request', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/guest-requests/1')
        .expect(200);
    });
  });
});
