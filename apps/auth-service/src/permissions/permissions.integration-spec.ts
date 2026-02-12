import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { PermissionsModule } from './permissions.module';
import { PermissionsService } from './permissions.service';
import { SystemPermission } from './entities/system-permission.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';

describe('PermissionsService (integration)', () => {
  let module: TestingModule;
  let service: PermissionsService;

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
            entities: [SystemPermission, RolePermission, Role, User, UserRole],
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
        PermissionsModule,
      ],
    }).compile();

    service = module.get(PermissionsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a permission', async () => {
    const result = await service.create({
      resource: 'users',
      action: 'read',
      description: 'Read users',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.resource).toBe('users');
    expect(result.action).toBe('read');
  });

  it('should find all permissions', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find permission by id', async () => {
    const created = await service.create({
      resource: 'users',
      action: 'write',
      description: 'Write users',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
  });

  it('should update a permission', async () => {
    const created = await service.create({
      resource: 'roles',
      action: 'read',
      description: 'Read roles',
    });

    const updated = await service.update(created.id, {
      description: 'Read all roles',
    });
    expect(updated.description).toBe('Read all roles');
  });

  it('should remove a permission not assigned to roles', async () => {
    const created = await service.create({
      resource: 'temp',
      action: 'delete',
      description: 'Temporary',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should throw 404 for non-existent permission', async () => {
    await expect(service.findOne(99999)).rejects.toThrow();
  });
});
