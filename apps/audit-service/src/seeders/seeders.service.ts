import { Injectable } from '@nestjs/common';
import { AuditLogsSeeder } from './domains';

@Injectable()
export class SeedersService {
  constructor(private auditLogsSeeder: AuditLogsSeeder) {}

  async seed() {
    console.log('🌱 Starting Audit service seeding...');

    await this.auditLogsSeeder.seed();

    console.log('🎉 Audit service seeding completed!');
  }
}
