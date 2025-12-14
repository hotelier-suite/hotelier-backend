import { Injectable } from '@nestjs/common';
import { EmployeesSeeder } from './domains/employees.seeder';
import { StaffSeeder } from './domains/staff.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private employeesSeeder: EmployeesSeeder,
    private staffSeeder: StaffSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting Employees module seeding...');

    await this.employeesSeeder.seed();
    console.log('✅ Employees seeded');

    await this.staffSeeder.seed();
    console.log('✅ Staff seeded');

    console.log('🎉 Employees module seeding completed!');
  }
}
