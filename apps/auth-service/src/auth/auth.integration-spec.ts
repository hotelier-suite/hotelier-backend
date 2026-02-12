import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { SystemPermission } from '../permissions/entities/system-permission.entity';
import { UsersModule } from '../users/users.module';
import { RolesModule } from '../roles/roles.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { TokensModule } from '../tokens/tokens.module';
import { AccessControlModule } from '../access-control/access-control.module';

describe('AuthService (integration)', () => {
  let module: TestingModule;
  let service: AuthService;
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
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              JWT_SECRET: 'test-secret-key-for-auth-integration',
              JWT_EXPIRES_IN: '15m',
              REFRESH_TOKEN_EXPIRES_IN: '7d',
            }),
          ],
        }),
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
        TypeOrmModule.forFeature([
          User,
          Role,
          SystemPermission,
          UserRole,
          RolePermission,
        ]),
        JwtModule.register({
          secret: 'test-secret-key-for-auth-integration',
          signOptions: { expiresIn: '15m' },
        }),
        UsersModule,
        RolesModule,
        PermissionsModule,
        TokensModule,
        AccessControlModule,
      ],
      providers: [AuthService],
    }).compile();

    service = module.get(AuthService);
    roleRepo = module.get(getRepositoryToken(Role));

    // Seed default 'client' role used in registration
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

  it('should register a new user', async () => {
    const result = await service.register({
      email: 'newuser@hotel.com',
      password: 'SecurePass123!',
      name: 'New User',
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe('newuser@hotel.com');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
  });

  it('should reject duplicate email registration', async () => {
    await expect(
      service.register({
        email: 'newuser@hotel.com',
        password: 'AnotherPass456!',
        name: 'Duplicate User',
      }),
    ).rejects.toThrow();
  });

  it('should login with valid credentials', async () => {
    const result = await service.login({
      email: 'newuser@hotel.com',
      password: 'SecurePass123!',
    });

    expect(result).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.accessToken).toBeDefined();
  });

  it('should reject login with wrong password', async () => {
    await expect(
      service.login({
        email: 'newuser@hotel.com',
        password: 'WrongPassword!',
      }),
    ).rejects.toThrow();
  });

  it('should get user profile', async () => {
    const registered = await service.register({
      email: 'profile@hotel.com',
      password: 'ProfilePass123!',
      name: 'Profile User',
    });

    const profile = await service.getProfile(registered.user.id);
    expect(profile).toBeDefined();
    expect(profile.email).toBe('profile@hotel.com');
  });

  it('should logout a user', async () => {
    const registered = await service.register({
      email: 'logout@hotel.com',
      password: 'LogoutPass123!',
      name: 'Logout User',
    });

    const result = await service.logout(registered.user.id);
    expect(result).toBeDefined();
  });
});
