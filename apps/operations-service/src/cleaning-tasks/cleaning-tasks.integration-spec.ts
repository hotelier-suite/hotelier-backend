import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { CleaningTasksModule } from './cleaning-tasks.module';
import { CleaningTasksService } from './cleaning-tasks.service';
import { CleaningTask } from './entities/cleaning-task.entity';
import { CleaningStatus } from '@app/contracts/operations-service';
import { TaskPriority } from '@app/contracts/common';

describe('CleaningTasksService (integration)', () => {
  let module: TestingModule;
  let service: CleaningTasksService;

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
            entities: [CleaningTask],
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
        CleaningTasksModule,
      ],
    }).compile();

    service = module.get(CleaningTasksService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a cleaning task', async () => {
    const result = await service.create({
      roomNumber: '201',
      roomId: 201,
      priority: TaskPriority.NORMAL,
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.roomNumber).toBe('201');
    expect(result.status).toBe(CleaningStatus.PENDING);
  });

  it('should find all tasks', async () => {
    const results = await service.findAll();
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find task by id', async () => {
    const created = await service.create({
      roomNumber: '202',
      roomId: 202,
      priority: TaskPriority.HIGH,
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.priority).toBe(TaskPriority.HIGH);
  });

  it('should update task status', async () => {
    const created = await service.create({
      roomNumber: '203',
      roomId: 203,
    });

    const updated = await service.update(created.id, {
      status: CleaningStatus.COMPLETED,
      assignedEmployee: 'John Doe',
    });
    expect(updated.status).toBe(CleaningStatus.COMPLETED);
    expect(updated.assignedEmployee).toBe('John Doe');
  });

  it('should remove a task', async () => {
    const created = await service.create({
      roomNumber: '204',
      roomId: 204,
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });
});
