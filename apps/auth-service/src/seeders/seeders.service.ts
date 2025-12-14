import { Injectable } from '@nestjs/common';
import { PermissionsSeeder } from './domains/permissions.seeder';
import { RolesSeeder } from './domains/roles.seeder';
import { UsersSeeder } from './domains/users.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private permissionsSeeder: PermissionsSeeder,
    private rolesSeeder: RolesSeeder,
    private usersSeeder: UsersSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting Auth module seeding...');

    // Order matters: permissions first, then roles, then users
    await this.permissionsSeeder.seed();
    console.log('✅ Permissions seeded');

    await this.rolesSeeder.seed();
    console.log('✅ Roles seeded');

    await this.usersSeeder.seed();
    console.log('✅ Users seeded');

    console.log('🎉 Auth module seeding completed!');
  }
}
