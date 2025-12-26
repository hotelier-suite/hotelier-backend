import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthDatabaseModule } from './database';
import { AuthModule } from './auth';
import { SeedersModule } from './seeders';
import { UsersModule } from './users';
import { RolesModule } from './roles';
import { PermissionsModule } from './permissions';

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
