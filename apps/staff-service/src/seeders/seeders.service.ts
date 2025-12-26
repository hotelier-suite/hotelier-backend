import { Injectable } from '@nestjs/common';
import { EmployeesSeeder } from '../employees';
import { ShiftsSeeder } from '../shifts';
import { AttendanceSeeder } from '../attendance';
import { EmployeeRequestsSeeder } from '../employee-requests';

@Injectable()
export class SeedersService {
  constructor(
    private readonly employeesSeeder: EmployeesSeeder,
    private readonly shiftsSeeder: ShiftsSeeder,
    private readonly attendanceSeeder: AttendanceSeeder,
    private readonly employeeRequestsSeeder: EmployeeRequestsSeeder,
  ) {}

  async seed(): Promise<void> {
    await this.employeesSeeder.seed();
    await this.shiftsSeeder.seed();
    await this.attendanceSeeder.seed();
    await this.employeeRequestsSeeder.seed();
  }
}
