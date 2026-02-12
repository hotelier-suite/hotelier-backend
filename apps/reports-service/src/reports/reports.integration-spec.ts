import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { ReportsModule } from './reports.module';
import { ReportsService } from './reports.service';
import { Report } from './entities';
import { ReportType, ReportStatus } from '@app/contracts/reports-service';

describe('ReportsService (integration)', () => {
  let module: TestingModule;
  let service: ReportsService;

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
            entities: [Report],
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
        ReportsModule,
      ],
    })
      .overrideProvider('BILLING_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .overrideProvider('BOOKING_SERVICE')
      .useValue({ send: jest.fn(), emit: jest.fn() })
      .compile();

    service = module.get(ReportsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a report', async () => {
    const result = await service.create({
      title: 'Monthly Occupancy Report - January 2026',
      type: ReportType.OCCUPANCY,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-01-31'),
      generatedBy: 'admin@hotel.com',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('Monthly Occupancy Report - January 2026');
    expect(result.type).toBe(ReportType.OCCUPANCY);
    expect(result.status).toBe(ReportStatus.PENDING);
  });

  it('should find a report by id', async () => {
    const created = await service.create({
      title: 'Revenue Report Q1',
      type: ReportType.REVENUE,
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-03-31'),
      generatedBy: 'manager@hotel.com',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.title).toBe('Revenue Report Q1');
    expect(found.type).toBe(ReportType.REVENUE);
  });

  it('should find all reports', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(2);
  });

  it('should filter reports by type', async () => {
    const results = await service.findAll({
      type: ReportType.OCCUPANCY,
    });

    results.forEach((r) => expect(r.type).toBe(ReportType.OCCUPANCY));
  });

  it('should filter reports by status', async () => {
    const results = await service.findAll({
      status: ReportStatus.PENDING,
    });

    results.forEach((r) => expect(r.status).toBe(ReportStatus.PENDING));
  });

  it('should store parameters as json', async () => {
    const parameters = {
      reportType: 'occupancy',
      dateRange: {
        startDate: new Date('2026-02-01'),
        endDate: new Date('2026-02-28'),
      },
    };

    const created = await service.create({
      title: 'Parameterized Report',
      type: ReportType.CUSTOM,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-28'),
      parameters,
      generatedBy: 'admin@hotel.com',
    });

    const found = await service.findOne(created.id);
    expect(found.parameters).toBeDefined();
    expect(found.parameters!.reportType).toBe('occupancy');
  });

  it('should update a report', async () => {
    const created = await service.create({
      title: 'Draft Report',
      type: ReportType.STAFF,
      startDate: new Date('2026-03-01'),
      endDate: new Date('2026-03-31'),
      generatedBy: 'hr@hotel.com',
    });

    const updated = await service.update(created.id, {
      title: 'Final Staff Report',
      status: ReportStatus.COMPLETED,
    });

    expect(updated.title).toBe('Final Staff Report');
    expect(updated.status).toBe(ReportStatus.COMPLETED);
  });

  it('should remove a report', async () => {
    const created = await service.create({
      title: 'Temporary Report',
      type: ReportType.MAINTENANCE,
      startDate: new Date('2026-04-01'),
      endDate: new Date('2026-04-30'),
      generatedBy: 'ops@hotel.com',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
    expect(removed.title).toBe('Temporary Report');

    await expect(service.findOne(created.id)).rejects.toThrow();
  });

  it('should generate an occupancy report', async () => {
    const result = await service.generateOccupancyReport(
      new Date('2026-05-01'),
      new Date('2026-05-31'),
      'admin@hotel.com',
    );

    expect(result).toBeDefined();
    expect(result.type).toBe(ReportType.OCCUPANCY);
    expect(result.title).toContain('Occupancy Report');
    expect(result.generatedBy).toBe('admin@hotel.com');
  });

  it('should generate a revenue report', async () => {
    const result = await service.generateRevenueReport(
      new Date('2026-06-01'),
      new Date('2026-06-30'),
      'finance@hotel.com',
    );

    expect(result).toBeDefined();
    expect(result.type).toBe(ReportType.REVENUE);
    expect(result.title).toContain('Revenue Report');
  });

  it('should generate a guest satisfaction report', async () => {
    const result = await service.generateGuestSatisfactionReport(
      new Date('2026-07-01'),
      new Date('2026-07-31'),
      'gm@hotel.com',
    );

    expect(result).toBeDefined();
    expect(result.type).toBe(ReportType.GUEST_SATISFACTION);
    expect(result.title).toContain('Guest Satisfaction Report');
  });
});
