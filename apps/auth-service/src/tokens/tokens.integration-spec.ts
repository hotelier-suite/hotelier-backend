import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { newDb, DataType } from 'pg-mem';
import { ConfigModule } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TokensModule } from './tokens.module';
import { TokensService } from './tokens.service';
import { User } from '../users/entities/user.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { Role } from '../roles/entities/role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';
import { SystemPermission } from '../permissions/entities/system-permission.entity';

describe('TokensService (integration)', () => {
  let module: TestingModule;
  let service: TokensService;
  let userRepo: Repository<User>;
  let userId: number;

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
              JWT_SECRET: 'test-secret-key-for-integration',
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
        TokensModule,
      ],
    }).compile();

    service = module.get(TokensService);
    userRepo = module.get(getRepositoryToken(User));

    const user = await userRepo.save(
      userRepo.create({
        email: 'tokentest@hotel.com',
        password: 'hashedpassword',
        name: 'Token Test User',
      }),
    );
    userId = user.id;
  });

  afterAll(async () => {
    await module.close();
  });

  it('should generate access and refresh tokens', async () => {
    const tokens = await service.getTokens(userId, 'tokentest@hotel.com');

    expect(tokens).toBeDefined();
    expect(tokens.accessToken).toBeDefined();
    expect(tokens.refreshToken).toBeDefined();
    expect(typeof tokens.accessToken).toBe('string');
    expect(typeof tokens.refreshToken).toBe('string');
  });

  it('should update refresh token in database', async () => {
    const tokens = await service.getTokens(userId, 'tokentest@hotel.com');
    await service.updateRefreshToken(userId, tokens.refreshToken);

    // Verify user has a refresh token stored (hashed with bcrypt)
    const user = await userRepo.findOne({
      where: { id: userId },
      select: ['id', 'refreshToken'],
    });
    expect(user!.refreshToken).toBeDefined();
    expect(user!.refreshToken).not.toBe(tokens.refreshToken); // stored as bcrypt hash
  });
});
