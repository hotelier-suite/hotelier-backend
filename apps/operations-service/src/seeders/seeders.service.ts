import { Injectable } from '@nestjs/common';
import { CleaningTasksSeeder } from '../cleaning-tasks';
import { CleaningAssignmentsSeeder } from '../cleaning-assignments';
import { MaintenanceReportsSeeder } from '../maintenance-reports';
import { MaintenanceRequestsSeeder } from '../maintenance-requests';
import { MaintenanceSeeder } from '../maintenance';

@Injectable()
export class SeedersService {
  constructor(
    private readonly cleaningTasksSeeder: CleaningTasksSeeder,
    private readonly cleaningAssignmentsSeeder: CleaningAssignmentsSeeder,
    private readonly maintenanceReportsSeeder: MaintenanceReportsSeeder,
    private readonly maintenanceRequestsSeeder: MaintenanceRequestsSeeder,
    private readonly maintenanceSeeder: MaintenanceSeeder,
  ) {}

  async seed(): Promise<void> {
    await this.cleaningTasksSeeder.seed();
    await this.cleaningAssignmentsSeeder.seed();
    await this.maintenanceReportsSeeder.seed();
    await this.maintenanceRequestsSeeder.seed();
    await this.maintenanceSeeder.seed();
  }
}
