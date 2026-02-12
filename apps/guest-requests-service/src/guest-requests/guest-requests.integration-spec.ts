import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { GuestRequestsModule } from './guest-requests.module';
import { GuestRequestsService } from './guest-requests.service';
import { GuestRequest } from './entities/guest-request.entity';
import {
  GuestRequestType,
  GuestRequestStatus,
  RequestPriority,
} from '@app/contracts/guest-requests-service';

describe('GuestRequestsService (integration)', () => {
  let module: TestingModule;
  let service: GuestRequestsService;

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
            entities: [GuestRequest],
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
        GuestRequestsModule,
      ],
    }).compile();

    service = module.get(GuestRequestsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a guest request', async () => {
    const result = await service.create({
      room: '101',
      guestName: 'John Doe',
      type: GuestRequestType.TOWELS,
      description: 'Need extra towels',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.room).toBe('101');
    expect(result.guestName).toBe('John Doe');
    expect(result.type).toBe(GuestRequestType.TOWELS);
    expect(result.status).toBe(GuestRequestStatus.PENDING);
  });

  it('should find all guest requests', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find a guest request by id', async () => {
    const created = await service.create({
      room: '202',
      guestName: 'Jane Smith',
      type: GuestRequestType.ROOM_SERVICE,
      description: 'Room service order',
      priority: RequestPriority.HIGH,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.priority).toBe(RequestPriority.HIGH);
  });

  it('should throw 404 for non-existent request', async () => {
    await expect(service.findOne(99999)).rejects.toMatchObject({
      error: { statusCode: 404 },
    });
  });

  it('should update a guest request', async () => {
    const created = await service.create({
      room: '303',
      guestName: 'Bob Wilson',
      type: GuestRequestType.MAINTENANCE,
      description: 'Fix AC',
    });

    const updated = await service.update(created.id, {
      status: GuestRequestStatus.IN_PROGRESS,
      assignedTo: 'Maintenance Team',
    });

    expect(updated.status).toBe(GuestRequestStatus.IN_PROGRESS);
    expect(updated.assignedTo).toBe('Maintenance Team');
  });

  it('should remove a guest request', async () => {
    const created = await service.create({
      room: '404',
      guestName: 'Delete Me',
      type: GuestRequestType.OTHER,
      description: 'Will be deleted',
    });

    const removed = await service.remove(created.id);
    expect(removed.guestName).toBe('Delete Me');

    await expect(service.findOne(created.id)).rejects.toMatchObject({
      error: { statusCode: 404 },
    });
  });

  it('should count by status', async () => {
    const count = await service.countByStatus(GuestRequestStatus.PENDING);
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it('should filter by status', async () => {
    const results = await service.findAll({
      status: GuestRequestStatus.PENDING,
    });
    results.forEach((r) => expect(r.status).toBe(GuestRequestStatus.PENDING));
  });
});
