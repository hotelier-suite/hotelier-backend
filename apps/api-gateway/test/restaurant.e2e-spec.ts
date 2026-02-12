import * as request from 'supertest';
import { App } from 'supertest/types';
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { of } from 'rxjs';
import { RestaurantServiceModule } from '../src/restaurant-service/restaurant-service.module';
import { RESTAURANT_SERVICE_CLIENT } from '../src/restaurant-service/constants';

describe('Restaurant Service (e2e)', () => {
  let app: INestApplication<App>;
  const mockClient = {
    send: jest.fn().mockReturnValue(of({})),
    emit: jest.fn().mockReturnValue(of({})),
    connect: jest.fn(),
    close: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RestaurantServiceModule],
    })
      .overrideProvider(RESTAURANT_SERVICE_CLIENT)
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

  // ─── Menu Items ───────────────────────────────────────────────────────

  describe('POST /api/restaurant/menu-items', () => {
    it('should create a menu item', () => {
      const mockItem = { id: 1, name: 'Caesar Salad' };
      mockClient.send.mockReturnValue(of(mockItem));

      return request(app.getHttpServer())
        .post('/api/restaurant/menu-items')
        .send({
          category: 'Appetizers',
          name: 'Caesar Salad',
          price: 12.99,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockItem);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/restaurant/menu-items')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/restaurant/menu-items', () => {
    it('should return all menu items', () => {
      const mockItems = [{ id: 1, name: 'Caesar Salad' }];
      mockClient.send.mockReturnValue(of(mockItems));

      return request(app.getHttpServer())
        .get('/api/restaurant/menu-items')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockItems);
        });
    });
  });

  describe('GET /api/restaurant/menu-items/:id', () => {
    it('should return a menu item by id', () => {
      const mockItem = { id: 1, name: 'Caesar Salad' };
      mockClient.send.mockReturnValue(of(mockItem));

      return request(app.getHttpServer())
        .get('/api/restaurant/menu-items/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockItem);
        });
    });
  });

  describe('PATCH /api/restaurant/menu-items/:id', () => {
    it('should update a menu item', () => {
      mockClient.send.mockReturnValue(of({ id: 1, price: 14.99 }));

      return request(app.getHttpServer())
        .patch('/api/restaurant/menu-items/1')
        .send({ price: 14.99 })
        .expect(200);
    });
  });

  describe('DELETE /api/restaurant/menu-items/:id', () => {
    it('should delete a menu item', () => {
      mockClient.send.mockReturnValue(of({ id: 1 }));

      return request(app.getHttpServer())
        .delete('/api/restaurant/menu-items/1')
        .expect(200);
    });
  });

  // ─── Room Service Orders ──────────────────────────────────────────────

  describe('POST /api/restaurant/room-service-orders', () => {
    it('should create a room service order', () => {
      const mockOrder = { id: 1, room: '101' };
      mockClient.send.mockReturnValue(of(mockOrder));

      return request(app.getHttpServer())
        .post('/api/restaurant/room-service-orders')
        .send({
          room: '101',
          guest: 'John Smith',
          items: [{ item: 'Caesar Salad', quantity: 2, price: 12.99 }],
          total: 25.98,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockOrder);
        });
    });

    it('should return 400 for empty body', () => {
      return request(app.getHttpServer())
        .post('/api/restaurant/room-service-orders')
        .send({})
        .expect(400);
    });
  });

  describe('GET /api/restaurant/room-service-orders', () => {
    it('should return all room service orders', () => {
      const mockOrders = [{ id: 1, room: '101' }];
      mockClient.send.mockReturnValue(of(mockOrders));

      return request(app.getHttpServer())
        .get('/api/restaurant/room-service-orders')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockOrders);
        });
    });
  });

  describe('GET /api/restaurant/room-service-orders/:id', () => {
    it('should return a room service order by id', () => {
      const mockOrder = { id: 1, room: '101' };
      mockClient.send.mockReturnValue(of(mockOrder));

      return request(app.getHttpServer())
        .get('/api/restaurant/room-service-orders/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockOrder);
        });
    });
  });

  describe('PATCH /api/restaurant/room-service-orders/:id', () => {
    it('should update a room service order', () => {
      mockClient.send.mockReturnValue(of({ id: 1, status: 'DELIVERED' }));

      return request(app.getHttpServer())
        .patch('/api/restaurant/room-service-orders/1')
        .send({ status: 'DELIVERED' })
        .expect(200);
    });
  });

  // ─── Beverage Inventory ───────────────────────────────────────────────

  describe('POST /api/restaurant/beverage-inventory', () => {
    it('should create a beverage item', () => {
      const mockBeverage = { id: 1, name: 'Orange Juice' };
      mockClient.send.mockReturnValue(of(mockBeverage));

      return request(app.getHttpServer())
        .post('/api/restaurant/beverage-inventory')
        .send({
          name: 'Orange Juice',
          category: 'Juices',
          stock: 100,
          minimumStock: 20,
          unit: 'liters',
          unitCost: 3.5,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toEqual(mockBeverage);
        });
    });
  });

  describe('GET /api/restaurant/beverage-inventory', () => {
    it('should return all beverage items', () => {
      const mockBeverages = [{ id: 1, name: 'Orange Juice' }];
      mockClient.send.mockReturnValue(of(mockBeverages));

      return request(app.getHttpServer())
        .get('/api/restaurant/beverage-inventory')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockBeverages);
        });
    });
  });

  describe('GET /api/restaurant/beverage-inventory/:id', () => {
    it('should return a beverage item by id', () => {
      const mockBeverage = { id: 1, name: 'Orange Juice' };
      mockClient.send.mockReturnValue(of(mockBeverage));

      return request(app.getHttpServer())
        .get('/api/restaurant/beverage-inventory/1')
        .expect(200)
        .expect((res) => {
          expect(res.body).toEqual(mockBeverage);
        });
    });
  });

  describe('PATCH /api/restaurant/beverage-inventory/:id', () => {
    it('should update a beverage item', () => {
      mockClient.send.mockReturnValue(of({ id: 1, stock: 150 }));

      return request(app.getHttpServer())
        .patch('/api/restaurant/beverage-inventory/1')
        .send({ stock: 150 })
        .expect(200);
    });
  });
});
