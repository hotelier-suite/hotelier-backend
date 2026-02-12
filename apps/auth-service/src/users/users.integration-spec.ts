import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UserRole } from './entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { SystemPermission } from '../permissions/entities/system-permission.entity';
import { AccessControlModule } from '../access-control/access-control.module';

describe('UsersService (integration)', () => {
  let module: TestingModule;
  let service: UsersService;
  let roleRepo: Repository<Role>;

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
            entities: [User, UserRole, Role, RolePermission, SystemPermission],
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
        UsersModule,
        AccessControlModule,
      ],
    }).compile();

    service = module.get(UsersService);
    roleRepo = module.get(getRepositoryToken(Role));

    // Seed a default 'client' role (used by getDefaultRole)
    await roleRepo.save(
      roleRepo.create({
        name: 'client',
        description: 'Default client role',
      }),
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should create a user', async () => {
    const result = await service.create({
      email: 'user1@hotel.com',
      password: 'password123',
      name: 'User One',
    });

    expect(result).toBeDefined();
    expect(result.id).toBeDefined();
    expect(result.email).toBe('user1@hotel.com');
  });

  it('should find all users', async () => {
    const results = await service.findAll({});
    expect(results.length).toBeGreaterThanOrEqual(1);
  });

  it('should find user by id', async () => {
    const created = await service.create({
      email: 'user2@hotel.com',
      password: 'password123',
      name: 'User Two',
    });

    const found = await service.findOne(created.id);
    expect(found.id).toBe(created.id);
    expect(found.email).toBe('user2@hotel.com');
  });

  it('should update a user', async () => {
    const created = await service.create({
      email: 'user3@hotel.com',
      password: 'password123',
      name: 'User Three',
    });

    const updated = await service.update(created.id, {
      name: 'Updated User Three',
    });
    expect(updated.name).toBe('Updated User Three');
  });

  it('should remove a user', async () => {
    const created = await service.create({
      email: 'user4@hotel.com',
      password: 'password123',
      name: 'To Remove',
    });

    const removed = await service.remove(created.id);
    expect(removed).toBeDefined();
  });

  it('should throw 404 for non-existent user', async () => {
    await expect(service.findOne(99999)).rejects.toThrow();
  });
});
