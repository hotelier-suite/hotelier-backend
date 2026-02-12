import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { RolesModule } from './roles.module';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { RolePermission } from './entities/role-permission.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { SystemPermission } from '../permissions/entities/system-permission.entity';
import { User } from '../users/entities/user.entity';

describe('RolesService (integration)', () => {
  let module: TestingModule;
  let service: RolesService;

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
            entities: [Role, RolePermission, UserRole, SystemPermission, User],
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
        RolesModule,
      ],
    }).compile();

    service = module.get(RolesService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a role', async () => {
    const result = await service.create({
      name: 'admin',
      description: 'Administrator role',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.name).toBe('admin');
  });

  it('should find all roles', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find role by id', async () => {
    const created = await service.create({
      name: 'staff',
      description: 'Staff role',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.name).toBe('staff');
  });

  it('should update a role', async () => {
    const created = await service.create({
      name: 'manager',
      description: 'Manager role',
    });

    const updated = await service.update(created.id, {
      description: 'Hotel Manager role',
    });
    expect(updated.description).toBe('Hotel Manager role');
  });

  it('should remove a non-system role without users', async () => {
    const created = await service.create({
      name: 'temp-role',
      description: 'Temporary',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should throw 404 for non-existent role', async () => {
    await expect(service.findOne(99999)).rejects.toThrow();
  });
});
