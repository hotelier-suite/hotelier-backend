import * as request from 'supertest';
import { App } from 'supertest/types';
import * as crypto from 'crypto';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { of } from 'rxjs';
import { NotificationsServiceModule } from '../src/notifications-service/notifications-service.module';
import { NOTIFICATIONS_SERVICE_CLIENT } from '../src/notifications-service/constants';
import { AuthServiceModule } from '../src/auth-service/auth-service.module';
import { AUTH_SERVICE_CLIENT } from '../src/auth-service/constants';

describe('Notifications Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };
  const signTestJwt = (
    payload: { sub: number; email: string } = {
      sub: 1,
      email: 'test@example.com',
    },
  ): string => {
    const header = Buffer.from(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    ).toString('base64url');
    const body = Buffer.from(
      JSON.stringify({
        ...payload,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600,
      }),
    ).toString('base64url');
    const secret = 'super-secret-jwt-key-change-in-production';
    const sig = crypto
      .createHmac('sha256', secret)
      .update(`${header}.${body}`)
      .digest('base64url');
    return `${header}.${body}.${sig}`;
  };
  const jwtToken = signTestJwt();

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        AuthServiceModule,
        NotificationsServiceModule,
      ],
    })
      .overrideProvider(NOTIFICATIONS_SERVICE_CLIENT)
      .useValue(mockClient)
      .overrideProvider(AUTH_SERVICE_CLIENT)
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

  describe('GET /api/notifications', () => {
    it('should return notifications for current user', () => {
      const mockNotifications = [{ id: 1, title: 'Low stock alert' }];
      mockClient.send.mockReturnValue(of(mockNotifications));

      return request(app.getHttpServer())
        .get('/api/notifications')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockNotifications);
        });
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer()).get('/api/notifications').expect(401);
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark a notification as read', () => {
      mockClient.send.mockReturnValue(of(undefined));

      return request(app.getHttpServer())
        .patch('/api/notifications/1/read')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });

    it('should return 401 without token', () => {
      return request(app.getHttpServer())
        .patch('/api/notifications/1/read')
        .expect(401);
    });
  });

  describe('PATCH /api/notifications/read-all', () => {
    it('should mark all notifications as read', () => {
      mockClient.send.mockReturnValue(of(undefined));

      return request(app.getHttpServer())
        .patch('/api/notifications/read-all')
        .set('Authorization', `Bearer ${jwtToken}`)
        .expect(200);
    });
  });
});
