import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { PermissionsSeeder } from './domains/permissions.seeder';
import { RolesSeeder } from './domains/roles.seeder';
import { UsersSeeder } from './domains/users.seeder';
import { User } from '../users/entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { SystemPermission } from '../permissions/entities/system-permission.entity';
import { UserRole } from '../users/entities/user-role.entity';
import { RolePermission } from '../roles/entities/role-permission.entity';

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
