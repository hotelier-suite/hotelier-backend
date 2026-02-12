import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { AuditModule } from './audit.module';
import { AuditService } from './audit.service';
import { AuditLog } from './entities/audit-log.entity';
import { AuditAction, AuditResource } from '@app/contracts/audit-service';

describe('AuditService (integration)', () => {
  let module: TestingModule;
  let service: AuditService;

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
            entities: [AuditLog],
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
        AuditModule,
      ],
    }).compile();

    service = module.get(AuditService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create an audit log', async () => {
    const result = await service.create({
      userId: 1,
      action: AuditAction.CREATE,
      resource: AuditResource.RESERVATION,
      resourceId: '42',
      description: 'Created reservation #42',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.userId).toBe(1);
    expect(result.action).toBe(AuditAction.CREATE);
    expect(result.resource).toBe(AuditResource.RESERVATION);
    expect(result.description).toBe('Created reservation #42');
  });

  it('should find audit log by id', async () => {
    const created = await service.create({
      userId: 2,
      action: AuditAction.UPDATE,
      resource: AuditResource.ROOM,
      description: 'Updated room',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.action).toBe(AuditAction.UPDATE);
  });

  it('should throw 404 for non-existent audit log', async () => {
    await expect(service.findOne(99999)).rejects.toMatchObject({
      error: { statusCode: 404 },
    });
  });

  it('should find all audit logs with pagination', async () => {
    const result = await service.findAll({ take: 10 });
    expect(result.data).toBeDefined();
    expect(result.total).toBeGreaterThanOrEqual(1);
    expect(result.data.length).toBeLessThanOrEqual(10);
  });

  it('should filter audit logs by userId', async () => {
    await service.create({
      userId: 99,
      action: AuditAction.DELETE,
      resource: AuditResource.INVOICE,
      description: 'Deleted invoice',
    });

    const result = await service.findAll({ userId: 99 });
    expect(result.data.length).toBeGreaterThanOrEqual(1);
    result.data.forEach((log) => expect(log.userId).toBe(99));
  });

  it('should filter audit logs by action', async () => {
    const result = await service.findAll({
      action: AuditAction.CREATE,
    });
    result.data.forEach((log) => expect(log.action).toBe(AuditAction.CREATE));
  });

  it('should create audit log with details', async () => {
    const details = { oldValue: 'A', newValue: 'B' };
    const result = await service.create({
      userId: 1,
      action: AuditAction.UPDATE,
      resource: AuditResource.USER,
      description: 'Updated user',
      details,
    });

    const found = await service.findOne(result.id);
    expect(found.details).toEqual(details);
  });
});
