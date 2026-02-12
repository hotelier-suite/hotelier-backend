import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { RoomsModule } from './rooms.module';
import { RoomsService } from './rooms.service';
import { Room } from './entities/room.entity';
import { RoomType } from '@app/contracts/booking-service';

describe('RoomsService (integration)', () => {
  let module: TestingModule;
  let service: RoomsService;

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
            entities: [Room],
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
        RoomsModule,
      ],
    }).compile();

    service = module.get(RoomsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a room', async () => {
    const result = await service.create({
      number: '101',
      type: RoomType.INDIVIDUAL,
      price: 100,
      capacity: 1,
      description: 'Standard single room',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.number).toBe('101');
    expect(result.isAvailable).toBe(true);
  });

  it('should find all rooms', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find room by id', async () => {
    const created = await service.create({
      number: '102',
      type: RoomType.DOBLE,
      price: 150,
      capacity: 2,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.type).toBe(RoomType.DOBLE);
  });

  it('should filter rooms by type', async () => {
    await service.create({
      number: '301',
      type: RoomType.SUITE,
      price: 350,
      capacity: 3,
    });

    const results = await service.findAll({ type: RoomType.SUITE });
    results.forEach((r) => expect(r.type).toBe(RoomType.SUITE));
  });

  it('should set room availability', async () => {
    const created = await service.create({
      number: '103',
      type: RoomType.INDIVIDUAL,
      price: 100,
      capacity: 1,
    });

    const updated = await service.setAvailability(created.id, false);
    expect(updated.isAvailable).toBe(false);
  });

  it('should update a room', async () => {
    const created = await service.create({
      number: '104',
      type: RoomType.INDIVIDUAL,
      price: 100,
      capacity: 1,
    });

    const updated = await service.update(created.id, { price: 120 });
    expect(updated.price).toBe(120);
  });

  it('should remove a room', async () => {
    const created = await service.create({
      number: '999',
      type: RoomType.INDIVIDUAL,
      price: 80,
      capacity: 1,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
