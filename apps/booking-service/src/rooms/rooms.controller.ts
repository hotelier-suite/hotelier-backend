import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RoomsService } from './rooms.service';
import {
  ROOMS_PATTERNS,
  RoomDto,
  CreateRoomDto,
  UpdateRoomDto,
  SetRoomAvailabilityDto,
  FindRoomsFilterDto,
} from '@app/contracts/booking-service';

@Controller()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @MessagePattern(ROOMS_PATTERNS.FIND_ALL)
  findAll(@Payload() filters: FindRoomsFilterDto): Promise<RoomDto[]> {
    return this.roomsService.findAll(filters);
  }

  @MessagePattern(ROOMS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<RoomDto> {
    return this.roomsService.findOne(id);
  }

  @MessagePattern(ROOMS_PATTERNS.CREATE)
  create(@Payload() data: CreateRoomDto): Promise<RoomDto> {
    return this.roomsService.create(data);
  }

  @MessagePattern(ROOMS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateRoomDto },
  ): Promise<RoomDto> {
    return this.roomsService.update(payload.id, payload.data);
  }

  @MessagePattern(ROOMS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<RoomDto> {
    return this.roomsService.remove(id);
  }

  @MessagePattern(ROOMS_PATTERNS.SET_AVAILABILITY)
  setAvailability(@Payload() data: SetRoomAvailabilityDto): Promise<RoomDto> {
    return this.roomsService.setAvailability(data.id, data.isAvailable);
  }
}
