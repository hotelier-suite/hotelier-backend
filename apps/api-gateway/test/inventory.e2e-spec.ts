import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { InventoryServiceModule } from '../src/inventory-service/inventory-service.module';
import { INVENTORY_SERVICE_CLIENT } from '../src/inventory-service/constants';

describe('Inventory Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [InventoryServiceModule],
    })
      .overrideProvider(INVENTORY_SERVICE_CLIENT)
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

  // ─── Items ────────────────────────────────────────────────────────────

  describe('POST /api/inventory/items', () => {
    it('should create an inventory item', () => {
      const mockItem = { id: 1, name: 'Bed Sheets' };
      mockClient.send.mockReturnValue(of(mockItem));

      return request(app.getHttpServer())
        .post('/api/inventory/items')
        .send({
          name: 'Bed Sheets - White Cotton',
          category: 'LINENS',
          currentStock: 100,
          minimumStock: 20,
          maximumStock: 200,
          unit: 'pieces',
          unitCost: 25.5,
          supplier: 'Linen Supply Co',
          location: 'Storage Room A',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockItem);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/inventory/items')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/inventory/items', () => {
    it('should return all inventory items', () => {
      const mockItems = [{ id: 1, name: 'Bed Sheets' }];
      mockClient.send.mockReturnValue(of(mockItems));

      return request(app.getHttpServer())
        .get('/api/inventory/items')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockItems);
        });
    });
  });

  describe('PATCH /api/inventory/items/:id', () => {
    it('should update an inventory item', () => {
      mockClient.send.mockReturnValue(of({ id: 1, currentStock: 150 }));

      return request(app.getHttpServer())
        .patch('/api/inventory/items/1')
        .send({ currentStock: 150 })
        .expect(200);
    });
  });

  describe('DELETE /api/inventory/items/:id', () => {
    it('should delete an inventory item', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/inventory/items/1')
        .expect(200);
    });
  });

  // ─── Suppliers ────────────────────────────────────────────────────────

  describe('POST /api/inventory/suppliers', () => {
    it('should create a supplier', () => {
      const mockSupplier = { id: 1, name: 'Linen Supply Co' };
      mockClient.send.mockReturnValue(of(mockSupplier));

      return request(app.getHttpServer())
        .post('/api/inventory/suppliers')
        .send({
          name: 'Linen Supply Co',
          contact: 'John Doe',
          phone: '+1-555-0123',
          email: 'contact@linensupply.com',
          address: '123 Supply Street, City, State 12345',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockSupplier);
        });
    });
  });

  describe('GET /api/inventory/suppliers', () => {
    it('should return all suppliers', () => {
      const mockSuppliers = [{ id: 1, name: 'Linen Supply Co' }];
      mockClient.send.mockReturnValue(of(mockSuppliers));

      return request(app.getHttpServer())
        .get('/api/inventory/suppliers')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockSuppliers);
        });
    });
  });

  describe('GET /api/inventory/suppliers/:id', () => {
    it('should return a supplier by id', () => {
      const mockSupplier = { id: 1, name: 'Linen Supply Co' };
      mockClient.send.mockReturnValue(of(mockSupplier));

      return request(app.getHttpServer())
        .get('/api/inventory/suppliers/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockSupplier);
        });
    });
  });

  describe('PATCH /api/inventory/suppliers/:id', () => {
    it('should update a supplier', () => {
      mockClient.send.mockReturnValue(of({ id: 1, name: 'Updated Co' }));

      return request(app.getHttpServer())
        .patch('/api/inventory/suppliers/1')
        .send({ name: 'Updated Co' })
        .expect(200);
    });
  });

  describe('DELETE /api/inventory/suppliers/:id', () => {
    it('should delete a supplier', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/inventory/suppliers/1')
        .expect(200);
    });
  });

  // ─── Movements ────────────────────────────────────────────────────────

  describe('POST /api/inventory/movements', () => {
    it('should create an inventory movement', () => {
      const mockMovement = { id: 1, type: 'IN', quantity: 50 };
      mockClient.send.mockReturnValue(of(mockMovement));

      return request(app.getHttpServer())
        .post('/api/inventory/movements')
        .send({
          type: 'IN',
          inventoryId: 1,
          quantity: 50,
          reason: 'Initial stock purchase',
          user: 'inventory_manager',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockMovement);
        });
    });
  });

  describe('GET /api/inventory/movements', () => {
    it('should return all movements', () => {
      const mockMovements = [{ id: 1, type: 'IN', quantity: 50 }];
      mockClient.send.mockReturnValue(of(mockMovements));

      return request(app.getHttpServer())
        .get('/api/inventory/movements')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockMovements);
        });
    });
  });
});
