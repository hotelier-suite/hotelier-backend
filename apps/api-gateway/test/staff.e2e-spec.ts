import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { StaffServiceModule } from '../src/staff-service/staff-service.module';
import { STAFF_SERVICE_CLIENT } from '../src/staff-service/constants';

describe('Staff Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [StaffServiceModule],
    })
      .overrideProvider(STAFF_SERVICE_CLIENT)
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

  // ─── Employees ────────────────────────────────────────────────────────

  describe('POST /api/employees', () => {
    it('should create an employee', () => {
      const mockEmployee = { id: 1, name: 'Jane Doe' };
      mockClient.send.mockReturnValue(of(mockEmployee));

      return request(app.getHttpServer())
        .post('/api/employees')
        .send({
          employeeId: 'EMP001',
          name: 'Jane Doe',
          department: 'HOUSEKEEPING',
          position: 'Supervisor',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockEmployee);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/employees')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/employees', () => {
    it('should return all employees', () => {
      const mockEmployees = [{ id: 1, name: 'Jane Doe' }];
      mockClient.send.mockReturnValue(of(mockEmployees));

      return request(app.getHttpServer())
        .get('/api/employees')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockEmployees);
        });
    });
  });

  describe('GET /api/employees/stats/departments', () => {
    it('should return department statistics', () => {
      const mockStats = { HOUSEKEEPING: 5, FRONT_DESK: 3 };
      mockClient.send.mockReturnValue(of(mockStats));

      return request(app.getHttpServer())
        .get('/api/employees/stats/departments')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockStats);
        });
    });
  });

  describe('GET /api/employees/:id', () => {
    it('should return an employee by id', () => {
      const mockEmployee = { id: 1, name: 'Jane Doe' };
      mockClient.send.mockReturnValue(of(mockEmployee));

      return request(app.getHttpServer())
        .get('/api/employees/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockEmployee);
        });
    });
  });

  describe('PATCH /api/employees/:id', () => {
    it('should update an employee', () => {
      mockClient.send.mockReturnValue(of({ id: 1, position: 'Manager' }));

      return request(app.getHttpServer())
        .patch('/api/employees/1')
        .send({ position: 'Manager' })
        .expect(200);
    });
  });

  describe('DELETE /api/employees/:id', () => {
    it('should delete an employee', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/employees/1')
        .expect(200);
    });
  });

  // ─── Shifts ───────────────────────────────────────────────────────────

  describe('POST /api/shifts', () => {
    it('should create a shift', () => {
      const mockShift = { id: 1, type: 'MORNING' };
      mockClient.send.mockReturnValue(of(mockShift));

      return request(app.getHttpServer())
        .post('/api/shifts')
        .send({
          date: '2025-06-15',
          startTime: '08:00',
          endTime: '16:00',
          type: 'MORNING',
          status: 'SCHEDULED',
          position: 'Receptionist',
          department: 'FRONT_DESK',
          employeeId: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockShift);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/shifts')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/shifts', () => {
    it('should return all shifts', () => {
      const mockShifts = [{ id: 1, type: 'MORNING' }];
      mockClient.send.mockReturnValue(of(mockShifts));

      return request(app.getHttpServer())
        .get('/api/shifts')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockShifts);
        });
    });
  });

  describe('GET /api/shifts/:id', () => {
    it('should return a shift by id', () => {
      const mockShift = { id: 1, type: 'MORNING' };
      mockClient.send.mockReturnValue(of(mockShift));

      return request(app.getHttpServer())
        .get('/api/shifts/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockShift);
        });
    });
  });

  describe('PATCH /api/shifts/:id', () => {
    it('should update a shift', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'COMPLETED' }));

      return request(app.getHttpServer())
        .patch('/api/shifts/1')
        .send({ status: 'COMPLETED' })
        .expect(200);
    });
  });

  describe('DELETE /api/shifts/:id', () => {
    it('should delete a shift', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer()).delete('/api/shifts/1').expect(200);
    });
  });

  // ─── Attendance ───────────────────────────────────────────────────────

  describe('POST /api/attendance', () => {
    it('should create an attendance record', () => {
      const mockAttendance = { id: 1, date: '2025-06-15' };
      mockClient.send.mockReturnValue(of(mockAttendance));

      return request(app.getHttpServer())
        .post('/api/attendance')
        .send({
          date: '2025-06-15',
          employeeId: 1,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockAttendance);
        });
    });
  });

  describe('GET /api/attendance', () => {
    it('should return all attendance records', () => {
      const mockRecords = [{ id: 1, date: '2025-06-15' }];
      mockClient.send.mockReturnValue(of(mockRecords));

      return request(app.getHttpServer())
        .get('/api/attendance')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRecords);
        });
    });
  });

  describe('GET /api/attendance/:id', () => {
    it('should return an attendance record by id', () => {
      const mockRecord = { id: 1, date: '2025-06-15' };
      mockClient.send.mockReturnValue(of(mockRecord));

      return request(app.getHttpServer())
        .get('/api/attendance/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRecord);
        });
    });
  });

  describe('PATCH /api/attendance/:id', () => {
    it('should update an attendance record', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'PRESENT' }));

      return request(app.getHttpServer())
        .patch('/api/attendance/1')
        .send({ status: 'PRESENT' })
        .expect(200);
    });
  });

  describe('DELETE /api/attendance/:id', () => {
    it('should delete an attendance record', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/attendance/1')
        .expect(200);
    });
  });

  describe('POST /api/attendance/check-in/:employeeId', () => {
    it('should check in an employee', () => {
      mockClient.send.mockReturnValue(
        of({ id: 1, checkIn: '2025-06-15T08:00:00Z' }),
      );

      return request(app.getHttpServer())
        .post('/api/attendance/check-in/1')
        .send({ time: '08:00' })
        .expect(201);
    });
  });

  describe('POST /api/attendance/check-out/:employeeId', () => {
    it('should check out an employee', () => {
      mockClient.send.mockReturnValue(
        of({ id: 1, checkOut: '2025-06-15T16:00:00Z' }),
      );

      return request(app.getHttpServer())
        .post('/api/attendance/check-out/1')
        .send({ time: '16:00' })
        .expect(201);
    });
  });

  // ─── Employee Requests (permissions) ──────────────────────────────────

  describe('POST /api/permissions', () => {
    it('should create an employee request', () => {
      const mockRequest = { id: 1, type: 'VACATION' };
      mockClient.send.mockReturnValue(of(mockRequest));

      return request(app.getHttpServer())
        .post('/api/permissions')
        .send({
          employeeId: 1,
          type: 'VACATION',
          reason: 'Family vacation',
          startDate: '2025-07-01',
          endDate: '2025-07-05',
          days: 5,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockRequest);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/permissions')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/permissions', () => {
    it('should return all employee requests', () => {
      const mockRequests = [{ id: 1, type: 'VACATION' }];
      mockClient.send.mockReturnValue(of(mockRequests));

      return request(app.getHttpServer())
        .get('/api/permissions')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockRequests);
        });
    });
  });

  describe('GET /api/permissions/:id', () => {
    it('should return an employee request by id', () => {
      const mockReq = { id: 1, type: 'VACATION' };
      mockClient.send.mockReturnValue(of(mockReq));

      return request(app.getHttpServer())
        .get('/api/permissions/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockReq);
        });
    });
  });

  describe('PATCH /api/permissions/:id', () => {
    it('should update an employee request', () => {
      mockClient.send.mockReturnValue(of({ id: 1, reason: 'Updated reason' }));

      return request(app.getHttpServer())
        .patch('/api/permissions/1')
        .send({ reason: 'Updated reason' })
        .expect(200);
    });
  });

  describe('PATCH /api/permissions/:id/approve', () => {
    it('should approve an employee request', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'APPROVED' }));

      return request(app.getHttpServer())
        .patch('/api/permissions/1/approve')
        .send({ approvedBy: 'admin' })
        .expect(200);
    });
  });

  describe('PATCH /api/permissions/:id/reject', () => {
    it('should reject an employee request', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'REJECTED' }));

      return request(app.getHttpServer())
        .patch('/api/permissions/1/reject')
        .send({ reason: 'Insufficient coverage' })
        .expect(200);
    });
  });

  describe('DELETE /api/permissions/:id', () => {
    it('should delete an employee request', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/permissions/1')
        .expect(200);
    });
  });
});
