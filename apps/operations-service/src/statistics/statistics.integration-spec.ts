import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { StatisticsModule } from './statistics.module';
import { StatisticsService } from './statistics.service';
import { CleaningAssignment } from '../cleaning-assignments/entities/cleaning-assignment.entity';
import { MaintenanceReport } from '../maintenance-reports/entities/maintenance-report.entity';
import { CleaningAssignmentsModule } from '../cleaning-assignments/cleaning-assignments.module';
import { MaintenanceReportsModule } from '../maintenance-reports/maintenance-reports.module';
import { CleaningAssignmentsService } from '../cleaning-assignments/cleaning-assignments.service';
import { MaintenanceReportsService } from '../maintenance-reports/maintenance-reports.service';
import { CleaningStatus } from '@app/contracts/operations-service';
import { HousekeepingMaintenanceType } from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('StatisticsService (integration)', () => {
  let module: TestingModule;
  let service: StatisticsService;
  let cleaningService: CleaningAssignmentsService;
  let reportsService: MaintenanceReportsService;

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
            entities: [CleaningAssignment, MaintenanceReport],
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
        StatisticsModule,
        CleaningAssignmentsModule,
        MaintenanceReportsModule,
      ],
    }).compile();

    service = module.get(StatisticsService);
    cleaningService = module.get(CleaningAssignmentsService);
    reportsService = module.get(MaintenanceReportsService);

    // Seed data
    const assignment = await cleaningService.create({
      roomId: 1,
    });
    await cleaningService.update(assignment.id, {
      status: CleaningStatus.COMPLETED,
      qualityScore: 4.5,
    });

    await reportsService.create({
      type: HousekeepingMaintenanceType.PLUMBING,
      description: 'Test report',
      priority: TaskPriority.NORMAL,
      reportedBy: 'Test User',
    });
  });

  afterAll(async () => {
    await module.close();
  });

  it('should get statistics', async () => {
    const stats = await service.getStatistics();
    expect(stats).toBeDefined();
  });

  it('should get cleaning performance', async () => {
    const perf = await service.getCleaningPerformance();
    expect(perf).toBeDefined();
    expect(perf.completionRate).toBeGreaterThanOrEqual(0);
  });

  it('should get cleaning performance by employeeId', async () => {
    const perf = await service.getCleaningPerformance(1);
    expect(perf).toBeDefined();
  });
});
