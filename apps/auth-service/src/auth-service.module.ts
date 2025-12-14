import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthDatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { SeedersModule } from './seeders/seeders.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthDatabaseModule,
    AuthModule,
    SeedersModule,
    UsersModule,
    RolesModule,
    PermissionsModule,
  ],
})
export class AuthServiceModule {}
