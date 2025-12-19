import { Injectable } from '@nestjs/common';
import { CleaningTasksSeeder } from './domains/cleaning-tasks.seeder';
import { CleaningAssignmentsSeeder } from './domains/cleaning-assignments.seeder';
import { MaintenanceRequestsSeeder } from './domains/maintenance-requests.seeder';
import { MaintenanceReportsSeeder } from './domains/maintenance-reports.seeder';

@Injectable()
export class SeedersService {
  constructor(
    private cleaningTasksSeeder: CleaningTasksSeeder,
    private cleaningAssignmentsSeeder: CleaningAssignmentsSeeder,
    private maintenanceRequestsSeeder: MaintenanceRequestsSeeder,
    private maintenanceReportsSeeder: MaintenanceReportsSeeder,
  ) {}

  async seed() {
    console.log('🌱 Starting Housekeeping module seeding...');

    // Order matters for dependencies
    await this.cleaningTasksSeeder.seed();
    console.log('✅ Cleaning tasks seeded');

    await this.cleaningAssignmentsSeeder.seed();
    console.log('✅ Cleaning assignments seeded');

    await this.maintenanceRequestsSeeder.seed();
    console.log('✅ Maintenance requests seeded');

    await this.maintenanceReportsSeeder.seed();
    console.log('✅ Maintenance reports seeded');

    console.log('🎉 Housekeeping module seeding completed!');
  }
}
