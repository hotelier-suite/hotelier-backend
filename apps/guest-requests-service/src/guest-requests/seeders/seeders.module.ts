import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestRequestsSeeder } from './guest-requests.seeder';
import { GuestRequest } from '../entities/guest-request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GuestRequest])],
  providers: [GuestRequestsSeeder],
  exports: [GuestRequestsSeeder],
})
export class GuestRequestsSeedersModule {}
