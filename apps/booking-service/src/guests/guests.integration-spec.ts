import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { GuestsModule } from './guests.module';
import { GuestsService } from './guests.service';
import { Guest } from './entities/guest.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { Room } from '../rooms/entities/room.entity';

describe('GuestsService (integration)', () => {
  let module: TestingModule;
  let service: GuestsService;

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
            entities: [Guest, Reservation, Room],
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
        GuestsModule,
      ],
    }).compile();

    service = module.get(GuestsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a guest', async () => {
    const result = await service.create({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      vip: false,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('John Doe');
    expect(result.email).toBe('john@example.com');
  });

  it('should find all guests', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find guest by id', async () => {
    const created = await service.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      vip: true,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.vip).toBe(true);
  });

  it('should update a guest', async () => {
    const created = await service.create({
      name: 'Bob Brown',
      email: 'bob@example.com',
      vip: false,
    });

    const updated = await service.update(created.id, { vip: true });
    expect(updated.vip).toBe(true);
  });

  it('should remove a guest', async () => {
    const created = await service.create({
      name: 'To Remove',
      email: 'remove@example.com',
      vip: false,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
