import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EventsService } from './events.service';
import {
  EVENTS_PATTERNS,
  EventDto,
  CreateEventDto,
  UpdateEventDto,
} from '@app/contracts/events-service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @MessagePattern(EVENTS_PATTERNS.FIND_ALL)
  findAll(): Promise<EventDto[]> {
    return this.eventsService.findAll();
  }

  @MessagePattern(EVENTS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<EventDto> {
    return this.eventsService.findOne(id);
  }

  @MessagePattern(EVENTS_PATTERNS.CREATE)
  create(@Payload() data: CreateEventDto): Promise<EventDto> {
    return this.eventsService.create(data);
  }

  @MessagePattern(EVENTS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateEventDto },
  ): Promise<EventDto> {
    return this.eventsService.update(payload.id, payload.data);
  }

  @MessagePattern(EVENTS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<EventDto> {
    return this.eventsService.remove(id);
  }
}
