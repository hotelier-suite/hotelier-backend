import { Injectable } from '@nestjs/common';
import { PermissionsSeeder, RolesSeeder, UsersSeeder } from './domains';

@Injectable()
export class SeedersService {
  constructor(
    private permissionsSeeder: PermissionsSeeder,
    private rolesSeeder: RolesSeeder,
    private usersSeeder: UsersSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting Auth module seeding...');

    await this.permissionsSeeder.seed();
    console.log('✅ Permissions seeded');

    await this.rolesSeeder.seed();
    console.log('✅ Roles seeded');

    await this.usersSeeder.seed();
    console.log('✅ Users seeded');

    console.log('🎉 Auth module seeding completed!');
  }
}
