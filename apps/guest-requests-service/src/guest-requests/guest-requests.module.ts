import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GuestRequest } from './entities';
import { GuestRequestsController } from './guest-requests.controller';
import { GuestRequestsService } from './guest-requests.service';

@Module({
  imports: [TypeOrmModule.forFeature([GuestRequest])],
  controllers: [GuestRequestsController],
  providers: [GuestRequestsService],
  exports: [GuestRequestsService],
})
export class GuestRequestsModule {}
