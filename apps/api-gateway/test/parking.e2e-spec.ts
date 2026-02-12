import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { ParkingServiceModule } from '../src/parking-service/parking-service.module';
import { PARKING_SERVICE_CLIENT } from '../src/parking-service/constants';

describe('Parking Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ParkingServiceModule],
    })
      .overrideProvider(PARKING_SERVICE_CLIENT)
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

  // ─── Vehicles ─────────────────────────────────────────────────────────

  describe('POST /api/parking/vehicles', () => {
    it('should register a vehicle', () => {
      const mockVehicle = { id: 1, licensePlate: 'ABC-123' };
      mockClient.send.mockReturnValue(of(mockVehicle));

      return request(app.getHttpServer())
        .post('/api/parking/vehicles')
        .send({
          licensePlate: 'ABC-123',
          brand: 'Toyota',
          model: 'Camry',
          color: 'Blue',
          type: 'CAR',
          owner: 'John Smith',
          guestType: 'GUEST',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockVehicle);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/parking/vehicles')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/parking/vehicles', () => {
    it('should return all vehicles', () => {
      const mockVehicles = [{ id: 1, licensePlate: 'ABC-123' }];
      mockClient.send.mockReturnValue(of(mockVehicles));

      return request(app.getHttpServer())
        .get('/api/parking/vehicles')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockVehicles);
        });
    });
  });

  describe('GET /api/parking/vehicles/:id', () => {
    it('should return a vehicle by id', () => {
      const mockVehicle = { id: 1, licensePlate: 'ABC-123' };
      mockClient.send.mockReturnValue(of(mockVehicle));

      return request(app.getHttpServer())
        .get('/api/parking/vehicles/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockVehicle);
        });
    });
  });

  describe('PATCH /api/parking/vehicles/:id', () => {
    it('should update a vehicle', () => {
      mockClient.send.mockReturnValue(of({ id: 1, color: 'Red' }));

      return request(app.getHttpServer())
        .patch('/api/parking/vehicles/1')
        .send({ color: 'Red' })
        .expect(200);
    });
  });

  describe('DELETE /api/parking/vehicles/:id', () => {
    it('should delete a vehicle', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/parking/vehicles/1')
        .expect(200);
    });
  });

  // ─── Spaces ───────────────────────────────────────────────────────────

  describe('POST /api/parking/spaces', () => {
    it('should create a parking space', () => {
      const mockSpace = { id: 1, code: 'G-001' };
      mockClient.send.mockReturnValue(of(mockSpace));

      return request(app.getHttpServer())
        .post('/api/parking/spaces')
        .send({
          code: 'G-001',
          zone: 'Ground Floor',
          type: 'GUEST',
          hourlyRate: 5.0,
          location: 'Ground Floor - Row A',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockSpace);
        });
    });
  });

  describe('GET /api/parking/spaces', () => {
    it('should return all parking spaces', () => {
      const mockSpaces = [{ id: 1, code: 'G-001' }];
      mockClient.send.mockReturnValue(of(mockSpaces));

      return request(app.getHttpServer())
        .get('/api/parking/spaces')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockSpaces);
        });
    });
  });

  describe('GET /api/parking/spaces/:id', () => {
    it('should return a parking space by id', () => {
      const mockSpace = { id: 1, code: 'G-001' };
      mockClient.send.mockReturnValue(of(mockSpace));

      return request(app.getHttpServer())
        .get('/api/parking/spaces/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockSpace);
        });
    });
  });

  describe('PATCH /api/parking/spaces/:id', () => {
    it('should update a parking space', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'OCCUPIED' }));

      return request(app.getHttpServer())
        .patch('/api/parking/spaces/1')
        .send({ status: 'OCCUPIED' })
        .expect(200);
    });
  });

  describe('DELETE /api/parking/spaces/:id', () => {
    it('should delete a parking space', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/parking/spaces/1')
        .expect(200);
    });
  });

  // ─── Incidents ────────────────────────────────────────────────────────

  describe('POST /api/parking/incidents', () => {
    it('should create a parking incident', () => {
      const mockIncident = { id: 1, type: 'VEHICLE_DAMAGE' };
      mockClient.send.mockReturnValue(of(mockIncident));

      return request(app.getHttpServer())
        .post('/api/parking/incidents')
        .send({
          type: 'VEHICLE_DAMAGE',
          description: 'Vehicle scratched while parking',
          responsible: 'John Smith',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockIncident);
        });
    });
  });

  describe('GET /api/parking/incidents', () => {
    it('should return all incidents', () => {
      const mockIncidents = [{ id: 1, type: 'VEHICLE_DAMAGE' }];
      mockClient.send.mockReturnValue(of(mockIncidents));

      return request(app.getHttpServer())
        .get('/api/parking/incidents')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockIncidents);
        });
    });
  });

  describe('GET /api/parking/incidents/:id', () => {
    it('should return an incident by id', () => {
      const mockIncident = { id: 1, type: 'VEHICLE_DAMAGE' };
      mockClient.send.mockReturnValue(of(mockIncident));

      return request(app.getHttpServer())
        .get('/api/parking/incidents/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockIncident);
        });
    });
  });

  describe('PATCH /api/parking/incidents/:id', () => {
    it('should update an incident', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'RESOLVED' }));

      return request(app.getHttpServer())
        .patch('/api/parking/incidents/1')
        .send({ status: 'RESOLVED' })
        .expect(200);
    });
  });

  describe('DELETE /api/parking/incidents/:id', () => {
    it('should delete an incident', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/parking/incidents/1')
        .expect(200);
    });
  });
});
