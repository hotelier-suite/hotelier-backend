import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { AuditServiceModule } from '../src/audit-service/audit-service.module';
import { AUDIT_SERVICE_CLIENT } from '../src/audit-service/constants';
import { AUTH_SERVICE_CLIENT } from '../src/auth-service/constants';

describe('Audit Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  const mockAuthClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AuditServiceModule],
    })
      .overrideProvider(AUDIT_SERVICE_CLIENT)
      .useValue(mockClient)
      .overrideProvider(AUTH_SERVICE_CLIENT)
      .useValue(mockAuthClient)
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

  // ─── Audit Logs ───────────────────────────────────────────────────────

  describe('POST /api/audit', () => {
    it('should create an audit log', () => {
      const mockLog = { id: 1, action: 'CREATE' };
      mockClient.send.mockReturnValue(of(mockLog));

      return request(app.getHttpServer())
        .post('/api/audit')
        .send({
          userId: 1,
          action: 'CREATE',
          resource: 'RESERVATION',
          description: 'Created a new reservation',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockLog);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/audit')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/audit', () => {
    it('should return audit logs', () => {
      const mockLogs = { data: [{ id: 1, userId: 1 }], total: 1 };
      mockClient.send.mockReturnValue(of(mockLogs));
      mockAuthClient.send.mockReturnValue(
        of({ id: 1, name: 'Admin', email: 'admin@example.com' }),
      );

      return request(app.getHttpServer())
        .get('/api/audit')
        .expect(200)
        .expect((res: request.Response) => {
          expect(
            (res.body as { data: unknown[]; total: number }).data,
          ).toHaveLength(1);
          expect((res.body as { data: unknown[]; total: number }).total).toBe(
            1,
          );
          expect(
            (res.body as { data: Array<{ user: unknown }> }).data[0].user,
          ).toBeDefined();
        });
    });
  });

  describe('GET /api/audit/statistics', () => {
    it('should return audit statistics', () => {
      const mockStats = { totalLogs: 100, topActions: [] };
      mockClient.send.mockReturnValue(of(mockStats));

      return request(app.getHttpServer())
        .get('/api/audit/statistics?days=30')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockStats);
        });
    });
  });

  describe('GET /api/audit/:id', () => {
    it('should return an audit log by id', () => {
      const mockLog = { id: 1, action: 'CREATE' };
      mockClient.send.mockReturnValue(of(mockLog));

      return request(app.getHttpServer())
        .get('/api/audit/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockLog);
        });
    });
  });
});
