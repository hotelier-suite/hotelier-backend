import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { ConfigServiceModule } from '../src/config-service/config-service.module';
import { CONFIG_SERVICE_CLIENT } from '../src/config-service/constants';

describe('Config Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ConfigServiceModule],
    })
      .overrideProvider(CONFIG_SERVICE_CLIENT)
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

  // ─── Hotel Configuration ──────────────────────────────────────────────

  describe('GET /api/configuration/hotel', () => {
    it('should return hotel configuration', () => {
      const mockConfig = {
        hotelName: 'Grand Hotel',
        address: '123 Main St',
        phone: '+1234567890',
      };
      mockClient.send.mockReturnValue(of(mockConfig));

      return request(app.getHttpServer())
        .get('/api/configuration/hotel')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockConfig);
        });
    });
  });

  describe('PATCH /api/configuration/hotel', () => {
    it('should update hotel configuration', () => {
      const mockUpdated = {
        hotelName: 'Updated Grand Hotel',
        address: '123 Main St',
      };
      mockClient.send.mockReturnValue(of(mockUpdated));

      return request(app.getHttpServer())
        .patch('/api/configuration/hotel')
        .send({ hotelName: 'Updated Grand Hotel' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockUpdated);
        });
    });
  });
});
