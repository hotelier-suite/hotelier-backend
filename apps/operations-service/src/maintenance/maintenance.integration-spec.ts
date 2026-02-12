import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { MaintenanceModule } from './maintenance.module';
import { MaintenanceService } from './maintenance.service';
import { GeneralMaintenanceRequest } from './entities/general-maintenance-request.entity';
import {
  MaintenanceType,
  MaintenancePriority,
  MaintenanceStatus,
} from '@app/contracts/operations-service';

describe('MaintenanceService (integration)', () => {
  let module: TestingModule;
  let service: MaintenanceService;

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
            entities: [GeneralMaintenanceRequest],
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
        MaintenanceModule,
      ],
    }).compile();

    service = module.get(MaintenanceService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a maintenance request', async () => {
    const result = await service.create({
      title: 'Fix AC Unit',
      type: MaintenanceType.CORRECTIVE,
      priority: MaintenancePriority.HIGH,
      location: 'Room 301',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('Fix AC Unit');
    expect(result.status).toBe(MaintenanceStatus.SCHEDULED);
  });

  it('should find all requests', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find request by id', async () => {
    const created = await service.create({
      title: 'Replace Lightbulbs',
      type: MaintenanceType.PREVENTIVE,
      priority: MaintenancePriority.LOW,
      location: 'Lobby',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should auto-set startedAt on IN_PROGRESS', async () => {
    const created = await service.create({
      title: 'Pipe Repair',
      type: MaintenanceType.EMERGENCY,
      priority: MaintenancePriority.URGENT,
      location: 'Room 505',
    });

    const updated = await service.update(created.id, {
      status: MaintenanceStatus.IN_PROGRESS,
    });
    expect(updated.status).toBe(MaintenanceStatus.IN_PROGRESS);
    expect(updated.startedAt).toBeDefined();
  });

  it('should auto-set completedAt on COMPLETED', async () => {
    const created = await service.create({
      title: 'Paint Touch-Up',
      type: MaintenanceType.CORRECTIVE,
      priority: MaintenancePriority.MEDIUM,
      location: 'Room 210',
    });

    await service.update(created.id, {
      status: MaintenanceStatus.IN_PROGRESS,
    });

    const completed = await service.update(created.id, {
      status: MaintenanceStatus.COMPLETED,
    });
    expect(completed.status).toBe(MaintenanceStatus.COMPLETED);
    expect(completed.completedAt).toBeDefined();
  });

  it('should remove a request', async () => {
    const created = await service.create({
      title: 'To Remove',
      type: MaintenanceType.INSPECTION,
      priority: MaintenancePriority.LOW,
      location: 'Storage',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
