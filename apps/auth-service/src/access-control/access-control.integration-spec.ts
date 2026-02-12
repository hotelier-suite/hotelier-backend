import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AccessControlModule } from './access-control.module';
import { AccessControlService } from './access-control.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { SystemPermission } from '../permissions/entities/system-permission.entity';

describe('AccessControlService (integration)', () => {
  let module: TestingModule;
  let service: AccessControlService;
  let userRepo: Repository<User>;
  let roleRepo: Repository<Role>;
  let userRoleRepo: Repository<UserRole>;
  let permissionRepo: Repository<SystemPermission>;
  let rolePermissionRepo: Repository<RolePermission>;

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
        AccessControlModule,
        TypeOrmModule.forFeature([
          User,
          UserRole,
          Role,
          RolePermission,
          SystemPermission,
        ]),
      ],
    }).compile();

    service = module.get(AccessControlService);
    userRepo = module.get(getRepositoryToken(User));
    roleRepo = module.get(getRepositoryToken(Role));
    userRoleRepo = module.get(getRepositoryToken(UserRole));
    permissionRepo = module.get(getRepositoryToken(SystemPermission));
    rolePermissionRepo = module.get(getRepositoryToken(RolePermission));

    // Seed test data
    const user = await userRepo.save(
      userRepo.create({
        email: 'actest@hotel.com',
        password: 'hashed',
        name: 'AC Test User',
      }),
    );

    const role = await roleRepo.save(
      roleRepo.create({
        name: 'ac-test-role',
        description: 'Test role for AC',
      }),
    );

    const permission = await permissionRepo.save(
      permissionRepo.create({
        resource: 'bookings',
        action: 'read',
        description: 'Read bookings',
      }),
    );

    await rolePermissionRepo.save(
      rolePermissionRepo.create({
        roleId: role.id,
        permissionId: permission.id,
      }),
    );

    await userRoleRepo.save(
      userRoleRepo.create({
        userId: user.id,
        roleId: role.id,
      }),
    );
  });

  afterAll(async () => {
    await module.close();
  });

  it('should get user with roles by id', async () => {
    const users = await userRepo.find();
    const user = await service.getUserWithRoles(users[0].id);
    expect(user).toBeDefined();
    expect(user!.email).toBe('actest@hotel.com');
  });

  it('should get user with roles by email', async () => {
    const user = await service.getUserWithRoles('actest@hotel.com');
    expect(user).toBeDefined();
  });

  it('should return null for non-existent user', async () => {
    const user = await service.getUserWithRoles(99999);
    expect(user).toBeNull();
  });

  it('should get user permissions as strings', async () => {
    const users = await userRepo.find();
    const permissions = await service.getUserPermissions(users[0].id);
    expect(permissions).toBeDefined();
    expect(Array.isArray(permissions)).toBe(true);
    expect(permissions).toContain('bookings:read');
  });

  it('should get user roles', async () => {
    const users = await userRepo.find();
    const roles = await service.getUserRoles(users[0].id);
    expect(roles).toBeDefined();
    expect(roles.length).toBeGreaterThanOrEqual(1);
  });
});
