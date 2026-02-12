import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { CleaningAssignmentsModule } from './cleaning-assignments.module';
import { CleaningAssignmentsService } from './cleaning-assignments.service';
import { CleaningAssignment } from './entities/cleaning-assignment.entity';
import { CleaningStatus } from '@app/contracts/operations-service';

describe('CleaningAssignmentsService (integration)', () => {
  let module: TestingModule;
  let service: CleaningAssignmentsService;

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
            entities: [CleaningAssignment],
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
        CleaningAssignmentsModule,
      ],
    }).compile();

    service = module.get(CleaningAssignmentsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a cleaning assignment', async () => {
    const result = await service.create({
      roomId: 101,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.status).toBe(CleaningStatus.PENDING);
    expect(result.roomId).toBe(101);
  });

  it('should find all assignments', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find assignment by id', async () => {
    const created = await service.create({
      roomId: 102,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should update assignment status', async () => {
    const created = await service.create({
      roomId: 103,
    });

    const updated = await service.update(created.id, {
      status: CleaningStatus.IN_PROGRESS,
    });
    expect(updated.status).toBe(CleaningStatus.IN_PROGRESS);
  });

  it('should remove an assignment', async () => {
    const created = await service.create({
      roomId: 104,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should throw 404 for non-existent assignment', async () => {
    await expect(service.findOne(99999)).rejects.toThrow();
  });
});
