import { Injectable } from '@nestjs/common';
import { EmployeeRequestsSeeder } from './domains/employee-requests.seeder';

@Injectable()
export class SeedersService {
  constructor(private employeeRequestsSeeder: EmployeeRequestsSeeder) {}

  async seed() {
    console.log('🌱 Starting Employee Requests module seeding...');

    await this.employeeRequestsSeeder.seed();

    console.log('🎉 Employee Requests module seeding completed!');
  }
}
