import { PartialType } from '@nestjs/swagger';
import { CreateRoomServiceOrderDto } from './create-room-service-order.dto';

export class UpdateRoomServiceOrderDto extends PartialType(
  CreateRoomServiceOrderDto,
) {}
