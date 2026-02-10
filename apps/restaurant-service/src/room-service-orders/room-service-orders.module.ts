import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoomServiceOrdersController } from './room-service-orders.controller';
import { RoomServiceOrdersService } from './room-service-orders.service';
import { RoomServiceOrder } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([RoomServiceOrder])],
  controllers: [RoomServiceOrdersController],
  providers: [RoomServiceOrdersService],
  exports: [RoomServiceOrdersService],
})
export class RoomServiceOrdersModule {}
