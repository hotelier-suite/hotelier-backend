import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { AnalyticsModule } from './analytics.module';
import { AnalyticsService } from './analytics.service';
import { AnalyticsData } from './entities/analytics-data.entity';
import { AnalyticsMetric } from '@app/contracts/reports-service';

describe('AnalyticsService (integration)', () => {
  let module: TestingModule;
  let service: AnalyticsService;

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
            entities: [AnalyticsData],
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
        AnalyticsModule,
      ],
    }).compile();

    service = module.get(AnalyticsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create analytics data', async () => {
    const result = await service.create({
      metric: AnalyticsMetric.OCCUPANCY_RATE,
      value: 85.5,
      date: new Date('2026-01-15'),
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.metric).toBe(AnalyticsMetric.OCCUPANCY_RATE);
  });

  it('should record a metric', async () => {
    const result = await service.recordMetric(
      AnalyticsMetric.REVENUE_PER_ROOM,
      150.0,
      new Date('2026-01-15'),
    );

    expect(result).toBeDefined();
    expect(result.metric).toBe(AnalyticsMetric.REVENUE_PER_ROOM);
  });

  it('should find analytics by id', async () => {
    const created = await service.create({
      metric: AnalyticsMetric.CUSTOMER_SATISFACTION,
      value: 4.5,
      date: new Date('2026-01-20'),
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.metric).toBe(AnalyticsMetric.CUSTOMER_SATISFACTION);
  });

  it('should find all analytics with filters', async () => {
    const results = await service.findAll({
      type: AnalyticsMetric.OCCUPANCY_RATE,
    });
    results.forEach((r) =>
      expect(r.metric).toBe(AnalyticsMetric.OCCUPANCY_RATE),
    );
  });

  it('should store metadata as json', async () => {
    const metadata = { source: 'survey', responseCount: 120 };
    const created = await service.create({
      metric: AnalyticsMetric.CUSTOMER_SATISFACTION,
      value: 4.2,
      date: new Date('2026-02-01'),
      metadata,
    });

    const found = await service.findOne(created.id);
    expect(found.metadata).toEqual(metadata);
  });

  it('should update analytics data', async () => {
    const created = await service.create({
      metric: AnalyticsMetric.AVERAGE_STAY_LENGTH,
      value: 3.5,
      date: new Date('2026-02-05'),
    });

    const updated = await service.update(created.id, { value: 4.0 });
    expect(updated).toBeDefined();
  });

  it('should remove analytics data', async () => {
    const created = await service.create({
      metric: AnalyticsMetric.STAFF_EFFICIENCY,
      value: 92.0,
      date: new Date('2026-02-10'),
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
