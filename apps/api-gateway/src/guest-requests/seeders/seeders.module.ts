import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedersService } from './seeders.service';
import { GuestRequestsSeeder } from './domains/guest-requests.seeder';
import { GuestRequest } from '../entities/guest-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuestRequest])],
  providers: [SeedersService, GuestRequestsSeeder],
  exports: [SeedersService],
})
export class SeedersModule {}
