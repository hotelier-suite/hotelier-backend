import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { WidgetsModule } from './widgets.module';
import { WidgetsService } from './widgets.service';
import { DashboardWidget } from './entities/dashboard-widget.entity';

describe('WidgetsService (integration)', () => {
  let module: TestingModule;
  let service: WidgetsService;

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
            entities: [DashboardWidget],
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
        WidgetsModule,
      ],
    }).compile();

    service = module.get(WidgetsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a widget', async () => {
    const result = await service.create({
      title: 'Occupancy Chart',
      type: 'bar-chart',
      configuration: { metric: 'occupancy', period: 'weekly' },
      position: 1,
      visible: true,
      userId: 1,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.title).toBe('Occupancy Chart');
    expect(result.type).toBe('bar-chart');
  });

  it('should store json configuration', async () => {
    const config = { metric: 'revenue', chartType: 'line', period: 'monthly' };
    const created = await service.create({
      title: 'Revenue Widget',
      type: 'line-chart',
      configuration: config,
      position: 2,
      visible: true,
      userId: 1,
    });

    const found = await service.findOne(created.id);
    expect(found.configuration).toEqual(config);
  });

  it('should find all visible widgets', async () => {
    const results = await service.findAll({});
    results.forEach((w) => expect(w.visible).toBe(true));
  });

  it('should filter widgets by userId', async () => {
    await service.create({
      title: 'User 99 Widget',
      type: 'stat',
      configuration: {},
      position: 1,
      visible: true,
      userId: 99,
    });

    const results = await service.findAll({ userId: 99 });
    expect(results.length).toBeGreaterThanOrEqual(1);
    results.forEach((w) => expect(w.userId).toBe(99));
  });

  it('should update a widget', async () => {
    const created = await service.create({
      title: 'To Update',
      type: 'stat',
      configuration: {},
      position: 3,
      visible: true,
      userId: 1,
    });

    const updated = await service.update(created.id, {
      title: 'Updated Widget',
      position: 5,
    });
    expect(updated.title).toBe('Updated Widget');
    expect(updated.position).toBe(5);
  });

  it('should remove a widget', async () => {
    const created = await service.create({
      title: 'To Remove',
      type: 'stat',
      configuration: {},
      position: 1,
      visible: true,
      userId: 1,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
