import { OmitType } from '@nestjs/swagger';
import { RoomServiceOrder } from '../entities/room-service-order.entity';

export class CreateRoomServiceOrderDto extends OmitType(RoomServiceOrder, [
  'id',
  'orderNumber',
  'orderTime',
  'status',
  'createdAt',
  'updatedAt',
]) {}
