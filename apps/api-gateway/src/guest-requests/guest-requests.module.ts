import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestRequestsService } from './guest-requests.service';
import { GuestRequestsController } from './guest-requests.controller';
import { GuestRequest } from './entities/guest-request.entity';
import { SeedersModule } from './seeders/seeders.module';

@Module({
  imports: [TypeOrmModule.forFeature([GuestRequest]), SeedersModule],
  controllers: [GuestRequestsController],
  providers: [GuestRequestsService],
  exports: [GuestRequestsService, SeedersModule],
})
export class GuestRequestsModule {}
