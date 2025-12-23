import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { AuditLogsSeeder } from './domains/audit-logs.seeder';
import { AuditLog } from '../audit/entities/audit-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [SeedersService, AuditLogsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
