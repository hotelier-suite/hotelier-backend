import { Module } from '@nestjs/common';
import { GuestRequestsController } from './guest-requests.controller';
import { GuestRequestsService } from './guest-requests.service';

@Module({
  controllers: [GuestRequestsController],
  providers: [GuestRequestsService],
  exports: [GuestRequestsService],
})
export class GuestRequestsModule {}
