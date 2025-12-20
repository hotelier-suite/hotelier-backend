import { Injectable } from '@nestjs/common';
import { EmployeesSeeder } from '../employees/seeders/employees.seeder';
import { ShiftsSeeder } from '../shifts/seeders/shifts.seeder';
import { AttendanceSeeder } from '../attendance/seeders/attendance.seeder';
import { EmployeeRequestsSeeder } from '../employee-requests/seeders/employee-requests.seeder';

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
