import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { DashboardServiceModule } from '../src/dashboard-service/dashboard-service.module';
import { DASHBOARD_SERVICE_CLIENT } from '../src/dashboard-service/constants';

describe('Dashboard Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [DashboardServiceModule],
    })
      .overrideProvider(DASHBOARD_SERVICE_CLIENT)
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
    // Simulate authenticated user for @CurrentUserId() decorator
    app.use((req: Record<string, unknown>, _res: unknown, next: () => void) => {
      req['user'] = { id: 1, email: 'test@example.com' };
      next();
    });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── Statistics ───────────────────────────────────────────────────────

  describe('GET /api/dashboard/stats', () => {
    it('should return dashboard stats', () => {
      const mockStats = { totalRooms: 100, occupiedRooms: 75 };
      mockClient.send.mockReturnValue(of(mockStats));

      return request(app.getHttpServer())
        .get('/api/dashboard/stats')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockStats);
        });
    });
  });

  describe('GET /api/dashboard/occupancy', () => {
    it('should return occupancy data', () => {
      const mockOccupancy = { rate: 0.75, trend: 'up' };
      mockClient.send.mockReturnValue(of(mockOccupancy));

      return request(app.getHttpServer())
        .get('/api/dashboard/occupancy')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockOccupancy);
        });
    });
  });

  describe('GET /api/dashboard/revenue', () => {
    it('should return revenue data', () => {
      const mockRevenue = { total: 50000, monthly: 12000 };
      mockClient.send.mockReturnValue(of(mockRevenue));

      return request(app.getHttpServer())
        .get('/api/dashboard/revenue')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRevenue);
        });
    });
  });

  describe('GET /api/dashboard/top-rooms', () => {
    it('should return top rooms', () => {
      const mockRooms = [{ roomNumber: '101', bookings: 30 }];
      mockClient.send.mockReturnValue(of(mockRooms));

      return request(app.getHttpServer())
        .get('/api/dashboard/top-rooms')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRooms);
        });
    });
  });

  describe('GET /api/dashboard/activity', () => {
    it('should return recent activities', () => {
      const mockActivities = [{ id: 1, action: 'CHECK_IN' }];
      mockClient.send.mockReturnValue(of(mockActivities));

      return request(app.getHttpServer())
        .get('/api/dashboard/activity')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockActivities);
        });
    });
  });

  // ─── Widgets ──────────────────────────────────────────────────────────

  describe('POST /api/dashboard/widgets', () => {
    it('should create a widget', () => {
      const mockWidget = {
        id: 1,
        title: 'Occupancy Chart',
        type: 'chart',
        configuration: { chartType: 'line' },
        userId: 1,
      };
      mockClient.send.mockReturnValue(of(mockWidget));

      return request(app.getHttpServer())
        .post('/api/dashboard/widgets')
        .send({
          title: 'Occupancy Chart',
          type: 'chart',
          configuration: { chartType: 'line' },
          userId: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockWidget);
        });
    });
  });

  describe('GET /api/dashboard/widgets', () => {
    it('should return all widgets', () => {
      const mockWidgets = [{ id: 1, name: 'occupancy' }];
      mockClient.send.mockReturnValue(of(mockWidgets));

      return request(app.getHttpServer())
        .get('/api/dashboard/widgets')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockWidgets);
        });
    });
  });

  describe('GET /api/dashboard/widgets/:id', () => {
    it('should return a widget by id', () => {
      const mockWidget = { id: 1, name: 'occupancy' };
      mockClient.send.mockReturnValue(of(mockWidget));

      return request(app.getHttpServer())
        .get('/api/dashboard/widgets/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockWidget);
        });
    });
  });

  describe('PATCH /api/dashboard/widgets/:id', () => {
    it('should update a widget', () => {
      mockClient.send.mockReturnValue(of({ id: 1, name: 'revenue' }));

      return request(app.getHttpServer())
        .patch('/api/dashboard/widgets/1')
        .send({ name: 'revenue' })
        .expect(200);
    });
  });

  describe('DELETE /api/dashboard/widgets/:id', () => {
    it('should delete a widget', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/dashboard/widgets/1')
        .expect(200);
    });
  });
});
