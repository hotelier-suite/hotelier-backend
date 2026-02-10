import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { AuditLogsSeeder } from './domains';
import { AuditLog } from '../audit';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [SeedersService, AuditLogsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
