import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ROOMS_PATTERNS } from '@app/contracts/booking-service/rooms/rooms.patterns';
import { RoomDto } from '@app/contracts/booking-service/rooms/dto/room.dto';
import { CreateRoomDto } from '@app/contracts/booking-service/rooms/dto/create-room.dto';
import { UpdateRoomDto } from '@app/contracts/booking-service/rooms/dto/update-room.dto';
import { SetRoomAvailabilityDto } from '@app/contracts/booking-service/rooms/dto/set-room-availability.dto';
import { RoomsService } from './rooms.service';

@Controller()
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @MessagePattern(ROOMS_PATTERNS.FIND_ALL)
  findAll(): Promise<RoomDto[]> {
    return this.roomsService.findAll();
  }

  @MessagePattern(ROOMS_PATTERNS.FIND_BY_ID)
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
