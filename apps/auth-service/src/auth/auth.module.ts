import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User, UserRole } from '../users';
import { Role, RolePermission } from '../roles';
import { SystemPermission } from '../permissions';
import { SeedersModule } from '../seeders';
import { UsersModule } from '../users';
import { RolesModule } from '../roles';
import { PermissionsModule } from '../permissions';
import { TokensModule } from '../tokens';
import { AccessControlModule } from '../access-control';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      SystemPermission,
      UserRole,
      RolePermission,
    ]),
    SeedersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    RolesModule,
    PermissionsModule,
    TokensModule,
    AccessControlModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, SeedersModule],
})
export class AuthModule {}
