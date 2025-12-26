import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { PermissionsSeeder, RolesSeeder, UsersSeeder } from './domains';
import { User, UserRole } from '../users';
import { Role, RolePermission } from '../roles';
import { SystemPermission } from '../permissions';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Role,
      SystemPermission,
      UserRole,
      RolePermission,
    ]),
  ],
  providers: [SeedersService, PermissionsSeeder, RolesSeeder, UsersSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
