import { Injectable } from '@nestjs/common';
import { AttendanceSeeder } from './domains/attendance.seeder';

@Injectable()
export class SeedersService {
  constructor(private attendanceSeeder: AttendanceSeeder) {}

  async seed() {
    await this.attendanceSeeder.seed();
  }
}
