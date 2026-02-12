import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { ReportsServiceModule } from '../src/reports-service/reports-service.module';
import { REPORTS_SERVICE_CLIENT } from '../src/reports-service/constants';

describe('Reports Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ReportsServiceModule],
    })
      .overrideProvider(REPORTS_SERVICE_CLIENT)
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

  // ─── Reports ──────────────────────────────────────────────────────────

  describe('POST /api/reports', () => {
    it('should create a report', () => {
      const mockReport = { id: 1, title: 'Monthly Occupancy' };
      mockClient.send.mockReturnValue(of(mockReport));

      return request(app.getHttpServer())
        .post('/api/reports')
        .send({
          title: 'Monthly Occupancy',
          type: 'OCCUPANCY',
          startDate: '2025-01-01',
          endDate: '2025-01-31',
          generatedBy: 'admin',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockReport);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/reports')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/reports', () => {
    it('should return all reports', () => {
      const mockReports = [{ id: 1, title: 'Monthly Occupancy' }];
      mockClient.send.mockReturnValue(of(mockReports));

      return request(app.getHttpServer())
        .get('/api/reports')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockReports);
        });
    });
  });

  describe('GET /api/reports/:id', () => {
    it('should return a report by id', () => {
      const mockReport = { id: 1, title: 'Monthly Occupancy' };
      mockClient.send.mockReturnValue(of(mockReport));

      return request(app.getHttpServer())
        .get('/api/reports/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockReport);
        });
    });
  });

  describe('PATCH /api/reports/:id', () => {
    it('should update a report', () => {
      mockClient.send.mockReturnValue(of({ id: 1, title: 'Updated Report' }));

      return request(app.getHttpServer())
        .patch('/api/reports/1')
        .send({ title: 'Updated Report' })
        .expect(200);
    });
  });

  describe('DELETE /api/reports/:id', () => {
    it('should delete a report', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer()).delete('/api/reports/1').expect(200);
    });
  });

  // ─── Analytics ────────────────────────────────────────────────────────

  describe('POST /api/reports-analytics', () => {
    it('should create analytics data', () => {
      const mockData = { id: 1, metric: 'OCCUPANCY_RATE' };
      mockClient.send.mockReturnValue(of(mockData));

      return request(app.getHttpServer())
        .post('/api/reports-analytics')
        .send({
          metric: 'OCCUPANCY_RATE',
          value: 85.75,
          date: '2025-01-15',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockData);
        });
    });
  });

  describe('GET /api/reports-analytics', () => {
    it('should return all analytics data', () => {
      const mockData = [{ id: 1, metric: 'OCCUPANCY_RATE' }];
      mockClient.send.mockReturnValue(of(mockData));

      return request(app.getHttpServer())
        .get('/api/reports-analytics')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockData);
        });
    });
  });

  describe('GET /api/reports-analytics/:id', () => {
    it('should return analytics data by id', () => {
      const mockData = { id: 1, metric: 'OCCUPANCY_RATE' };
      mockClient.send.mockReturnValue(of(mockData));

      return request(app.getHttpServer())
        .get('/api/reports-analytics/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockData);
        });
    });
  });

  describe('PATCH /api/reports-analytics/:id', () => {
    it('should update analytics data', () => {
      mockClient.send.mockReturnValue(of({ id: 1, value: 90.0 }));

      return request(app.getHttpServer())
        .patch('/api/reports-analytics/1')
        .send({ value: 90.0 })
        .expect(200);
    });
  });

  describe('DELETE /api/reports-analytics/:id', () => {
    it('should delete analytics data', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/reports-analytics/1')
        .expect(200);
    });
  });
});
