import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { RoomServiceOrdersModule } from './room-service-orders.module';
import { RoomServiceOrdersService } from './room-service-orders.service';
import { RoomServiceOrder } from './entities/room-service-order.entity';
import { RoomServiceStatus } from '@app/contracts/restaurant-service';

describe('RoomServiceOrdersService (integration)', () => {
  let module: TestingModule;
  let service: RoomServiceOrdersService;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({
      name: 'current_database',
      returns: DataType.text,
      implementation: () => 'test',
    });
    db.public.registerFunction({
      name: 'version',
      returns: DataType.text,
      implementation: () => 'PostgreSQL 18.0 (pg-mem)',
    });

    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'postgres',
            entities: [RoomServiceOrder],
          }),
          dataSourceFactory: async (options) => {
            const ds = db.adapters.createTypeormDataSource(
              options,
            ) as DataSource;
            await ds.initialize();
            await ds.synchronize();
            return ds;
          },
        }),
        RoomServiceOrdersModule,
      ],
    }).compile();

    service = module.get(RoomServiceOrdersService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a room service order', async () => {
    const result = await service.create({
      room: '101',
      guest: 'John Doe',
      items: [
        { item: 'Club Sandwich', quantity: 1, price: 15.0 },
        { item: 'Coffee', quantity: 2, price: 4.5 },
      ],
      total: 24.0,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.guest).toBe('John Doe');
    expect(result.status).toBe(RoomServiceStatus.PENDING);
    expect(result.total).toBe(24.0);
  });

  it('should store json items', async () => {
    const items = [
      { item: 'Pasta', quantity: 1, price: 18.0 },
      { item: 'Wine', quantity: 1, price: 12.0 },
    ];

    const created = await service.create({
      room: '202',
      guest: 'Jane Smith',
      items,
      total: 30.0,
    });

    const found = await service.findOne(created.id);
    expect(found.items).toEqual(items);
  });

  it('should find all orders', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('should find order by id', async () => {
    const created = await service.create({
      room: '303',
      guest: 'Bob',
      items: [{ item: 'Burger', quantity: 1, price: 14.0 }],
      total: 14.0,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.room).toBe('303');
  });

  it('should update order status', async () => {
    const created = await service.create({
      room: '404',
      guest: 'Charlie',
      items: [{ item: 'Salad', quantity: 1, price: 10.0 }],
      total: 10.0,
    });

    const updated = await service.update(created.id, {
      status: RoomServiceStatus.PREPARING,
    });
    expect(updated.status).toBe(RoomServiceStatus.PREPARING);
  });

  it('should remove an order', async () => {
    const created = await service.create({
      room: '505',
      guest: 'Dave',
      items: [{ item: 'Tea', quantity: 1, price: 3.0 }],
      total: 3.0,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
