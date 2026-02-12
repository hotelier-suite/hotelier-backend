import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { MaintenanceRequestsModule } from './maintenance-requests.module';
import { MaintenanceRequestsService } from './maintenance-requests.service';
import { MaintenanceRequest } from './entities/maintenance-request.entity';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('MaintenanceRequestsService (integration)', () => {
  let module: TestingModule;
  let service: MaintenanceRequestsService;

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
            entities: [MaintenanceRequest],
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
        MaintenanceRequestsModule,
      ],
    }).compile();

    service = module.get(MaintenanceRequestsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a maintenance request', async () => {
    const result = await service.create({
      roomNumber: '401',
      roomId: 401,
      type: HousekeepingMaintenanceType.PLUMBING,
      description: 'Toilet clogged',
      priority: TaskPriority.URGENT,
      reportedBy: 'Guest Services',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.status).toBe(HousekeepingMaintenanceStatus.PENDING);
  });

  it('should find all requests', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find request by id', async () => {
    const created = await service.create({
      roomNumber: '402',
      roomId: 402,
      type: HousekeepingMaintenanceType.ELECTRICAL,
      description: 'Light flickering',
      reportedBy: 'Housekeeping',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should update a request', async () => {
    const created = await service.create({
      roomNumber: '403',
      roomId: 403,
      type: HousekeepingMaintenanceType.STRUCTURAL,
      description: 'Cracked wall',
      reportedBy: 'Maintenance Lead',
    });

    const updated = await service.update(created.id, {
      status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      assignedTo: 'Technician A',
    });
    expect(updated.status).toBe(HousekeepingMaintenanceStatus.IN_PROGRESS);
  });

  it('should remove a request', async () => {
    const created = await service.create({
      roomNumber: '404',
      roomId: 404,
      type: HousekeepingMaintenanceType.COSMETIC,
      description: 'Paint peeling',
      reportedBy: 'Inspector',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
