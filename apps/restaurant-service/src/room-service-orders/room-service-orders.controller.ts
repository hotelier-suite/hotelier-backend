import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoomServiceOrdersService } from './room-service-orders.service';
import {
  ROOM_SERVICE_ORDERS_PATTERNS,
  RoomServiceOrderDto,
  CreateRoomServiceOrderDto,
  UpdateRoomServiceOrderDto,
} from '@app/contracts/restaurant-service';

@Controller()
export class RoomServiceOrdersController {
  constructor(
    private readonly roomServiceOrdersService: RoomServiceOrdersService,
  ) {}

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.FIND_ALL)
  findAll(): Promise<RoomServiceOrderDto[]> {
    return this.roomServiceOrdersService.findAll();
  }

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<RoomServiceOrderDto> {
    return this.roomServiceOrdersService.findOne(id);
  }

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateRoomServiceOrderDto,
  ): Promise<RoomServiceOrderDto> {
    return this.roomServiceOrdersService.create(data);
  }

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateRoomServiceOrderDto },
  ): Promise<RoomServiceOrderDto> {
    return this.roomServiceOrdersService.update(payload.id, payload.data);
  }

  @MessagePattern(ROOM_SERVICE_ORDERS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<RoomServiceOrderDto> {
    return this.roomServiceOrdersService.remove(id);
  }
}
