import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { MaintenanceReportsModule } from './maintenance-reports.module';
import { MaintenanceReportsService } from './maintenance-reports.service';
import { MaintenanceReport } from './entities/maintenance-report.entity';
import {
  HousekeepingMaintenanceType,
  HousekeepingMaintenanceStatus,
} from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('MaintenanceReportsService (integration)', () => {
  let module: TestingModule;
  let service: MaintenanceReportsService;

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
            entities: [MaintenanceReport],
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
        MaintenanceReportsModule,
      ],
    }).compile();

    service = module.get(MaintenanceReportsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a report with auto-generated number', async () => {
    const result = await service.create({
      type: HousekeepingMaintenanceType.PLUMBING,
      description: 'Leaking faucet in bathroom',
      priority: TaskPriority.HIGH,
      reportedBy: 'Housekeeper A',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.reportNumber).toMatch(/^MR-/);
    expect(result.status).toBe(HousekeepingMaintenanceStatus.PENDING);
  });

  it('should find all reports', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find report by id', async () => {
    const created = await service.create({
      type: HousekeepingMaintenanceType.ELECTRICAL,
      description: 'Broken outlet',
      reportedBy: 'Housekeeper B',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should update a report', async () => {
    const created = await service.create({
      type: HousekeepingMaintenanceType.HVAC,
      description: 'AC not cooling',
      reportedBy: 'Housekeeper C',
    });

    const updated = await service.update(created.id, {
      status: HousekeepingMaintenanceStatus.IN_PROGRESS,
      assignedTechnician: 'Tech A',
    });
    expect(updated.status).toBe(HousekeepingMaintenanceStatus.IN_PROGRESS);
    expect(updated.assignedTechnician).toBe('Tech A');
  });

  it('should remove a report', async () => {
    const created = await service.create({
      type: HousekeepingMaintenanceType.FURNITURE,
      description: 'Broken chair',
      reportedBy: 'Housekeeper D',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
