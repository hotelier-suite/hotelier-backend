import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { OperationsServiceModule } from '../src/operations-service/operations-service.module';
import { OPERATIONS_SERVICE_CLIENT } from '../src/operations-service/constants';

describe('Operations Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [OperationsServiceModule],
    })
      .overrideProvider(OPERATIONS_SERVICE_CLIENT)
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

  // ─── Cleaning Tasks ───────────────────────────────────────────────────

  describe('POST /api/housekeeping/tasks', () => {
    it('should create a cleaning task', () => {
      const mockTask = { id: 1, roomNumber: '101' };
      mockClient.send.mockReturnValue(of(mockTask));

      return request(app.getHttpServer())
        .post('/api/housekeeping/tasks')
        .send({ roomNumber: '101', roomId: 1 })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockTask);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/housekeeping/tasks')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/housekeeping/tasks', () => {
    it('should return all cleaning tasks', () => {
      const mockTasks = [{ id: 1, roomNumber: '101' }];
      mockClient.send.mockReturnValue(of(mockTasks));

      return request(app.getHttpServer())
        .get('/api/housekeeping/tasks')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockTasks);
        });
    });
  });

  describe('GET /api/housekeeping/tasks/:id', () => {
    it('should return a cleaning task by id', () => {
      const mockTask = { id: 1, roomNumber: '101' };
      mockClient.send.mockReturnValue(of(mockTask));

      return request(app.getHttpServer())
        .get('/api/housekeeping/tasks/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockTask);
        });
    });
  });

  describe('PATCH /api/housekeeping/tasks/:id', () => {
    it('should update a cleaning task', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'COMPLETED' }));

      return request(app.getHttpServer())
        .patch('/api/housekeeping/tasks/1')
        .send({ status: 'COMPLETED' })
        .expect(200);
    });
  });

  describe('DELETE /api/housekeeping/tasks/:id', () => {
    it('should delete a cleaning task', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/housekeeping/tasks/1')
        .expect(200);
    });
  });

  // ─── Cleaning Assignments ─────────────────────────────────────────────

  describe('GET /api/housekeeping/assignments', () => {
    it('should return all cleaning assignments', () => {
      const mockAssignments = [{ id: 1, employeeName: 'Mary Johnson' }];
      mockClient.send.mockReturnValue(of(mockAssignments));

      return request(app.getHttpServer())
        .get('/api/housekeeping/assignments')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockAssignments);
        });
    });
  });

  describe('GET /api/housekeeping/assignments/:id', () => {
    it('should return an assignment by id', () => {
      const mockAssignment = { id: 1, employeeName: 'Mary Johnson' };
      mockClient.send.mockReturnValue(of(mockAssignment));

      return request(app.getHttpServer())
        .get('/api/housekeeping/assignments/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockAssignment);
        });
    });
  });

  // ─── Maintenance ──────────────────────────────────────────────────────

  describe('POST /api/maintenance', () => {
    it('should create a maintenance request', () => {
      const mockRequest = { id: 1, title: 'Fix AC in room 205' };
      mockClient.send.mockReturnValue(of(mockRequest));

      return request(app.getHttpServer())
        .post('/api/maintenance')
        .send({
          title: 'Fix AC in room 205',
          type: 'corrective',
          priority: 'high',
          location: 'Room 205',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockRequest);
        });
    });
  });

  describe('GET /api/maintenance', () => {
    it('should return all maintenance requests', () => {
      const mockRequests = [{ id: 1, title: 'Fix AC in room 205' }];
      mockClient.send.mockReturnValue(of(mockRequests));

      return request(app.getHttpServer())
        .get('/api/maintenance')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRequests);
        });
    });
  });

  describe('GET /api/maintenance/:id', () => {
    it('should return a maintenance request by id', () => {
      const mockRequest = { id: 1, title: 'Fix AC in room 205' };
      mockClient.send.mockReturnValue(of(mockRequest));

      return request(app.getHttpServer())
        .get('/api/maintenance/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRequest);
        });
    });
  });

  describe('PATCH /api/maintenance/:id', () => {
    it('should update a maintenance request', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'IN_PROGRESS' }));

      return request(app.getHttpServer())
        .patch('/api/maintenance/1')
        .send({ status: 'in_progress' })
        .expect(200);
    });
  });

  describe('DELETE /api/maintenance/:id', () => {
    it('should delete a maintenance request', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/maintenance/1')
        .expect(200);
    });
  });

  // ─── Housekeeping Maintenance Requests ────────────────────────────────

  describe('GET /api/housekeeping/maintenance-requests', () => {
    it('should return all maintenance requests', () => {
      const mockRequests = [{ id: 1, description: 'Broken faucet' }];
      mockClient.send.mockReturnValue(of(mockRequests));

      return request(app.getHttpServer())
        .get('/api/housekeeping/maintenance-requests')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRequests);
        });
    });
  });

  // ─── Housekeeping Maintenance Reports ─────────────────────────────────

  describe('GET /api/housekeeping/maintenance-reports', () => {
    it('should return all maintenance reports', () => {
      const mockReports = [{ id: 1, summary: 'Monthly report' }];
      mockClient.send.mockReturnValue(of(mockReports));

      return request(app.getHttpServer())
        .get('/api/housekeeping/maintenance-reports')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockReports);
        });
    });
  });

  // ─── Housekeeping Statistics ──────────────────────────────────────────

  describe('GET /api/housekeeping/statistics', () => {
    it('should return housekeeping statistics', () => {
      const mockStats = { totalTasks: 50, completed: 45 };
      mockClient.send.mockReturnValue(of(mockStats));

      return request(app.getHttpServer())
        .get('/api/housekeeping/statistics')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockStats);
        });
    });
  });
});
