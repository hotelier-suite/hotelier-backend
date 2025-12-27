import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { GuestsService } from './guests.service';
import {
  GUESTS_PATTERNS,
  GuestDto,
  CreateGuestDto,
  UpdateGuestDto,
  ListGuestsQueryDto,
} from '@app/contracts/booking-service';

@Controller()
export class GuestsController {
  constructor(private readonly guestsService: GuestsService) {}

  @MessagePattern(GUESTS_PATTERNS.FIND_ALL)
  findAll(@Payload() query: ListGuestsQueryDto): Promise<GuestDto[]> {
    return this.guestsService.findAll(query);
  }

  @MessagePattern(GUESTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<GuestDto> {
    return this.guestsService.findOne(id);
  }

  @MessagePattern(GUESTS_PATTERNS.CREATE)
  create(@Payload() data: CreateGuestDto): Promise<GuestDto> {
    return this.guestsService.create(data);
  }

  @MessagePattern(GUESTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateGuestDto },
  ): Promise<GuestDto> {
    return this.guestsService.update(payload.id, payload.data);
  }

  @MessagePattern(GUESTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<GuestDto> {
    return this.guestsService.remove(id);
  }
}
