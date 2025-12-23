import { Module } from '@nestjs/common';
import { RoomServiceOrdersController } from './room-service-orders.controller';
import { RoomServiceOrdersService } from './room-service-orders.service';

@Module({
  controllers: [RoomServiceOrdersController],
  providers: [RoomServiceOrdersService],
  exports: [RoomServiceOrdersService],
})
export class RoomServiceOrdersModule {}
