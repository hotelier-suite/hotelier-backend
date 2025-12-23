import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EVENTS_PATTERNS } from '@app/contracts/events-service/events/events.patterns';
import {
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from '@app/contracts/events-service/events/dto';
import { EventsService } from './events.service';

@Controller()
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Event patterns
  @MessagePattern(EVENTS_PATTERNS.FIND_ALL)
  findAllEvents(): Promise<EventDto[]> {
    return this.eventsService.findAllEvents();
  }

  @MessagePattern(EVENTS_PATTERNS.FIND_ONE)
  findOneEvent(@Payload() id: number): Promise<EventDto> {
    return this.eventsService.findOneEvent(id);
  }

  @MessagePattern(EVENTS_PATTERNS.CREATE)
  createEvent(@Payload() data: CreateEventDto): Promise<EventDto> {
    return this.eventsService.create(data);
  }

  @MessagePattern(EVENTS_PATTERNS.UPDATE)
  updateEvent(@Payload() payload: { id: number; data: UpdateEventDto }): Promise<EventDto> {
    return this.eventsService.update(payload.id, payload.data);
  }

  @MessagePattern(EVENTS_PATTERNS.DELETE)
  deleteEvent(@Payload() id: number): Promise<EventDto> {
    return this.eventsService.deleteEvent(id);
  }

  // Event Booking patterns
  @MessagePattern(EVENTS_PATTERNS.FIND_ALL_BOOKINGS)
  findAllBookings(): Promise<EventBookingDto[]> {
    return this.eventsService.findAllBookings();
  }

  @MessagePattern(EVENTS_PATTERNS.FIND_ONE_BOOKING)
  findOneBooking(@Payload() id: number): Promise<EventBookingDto> {
    return this.eventsService.findOneBooking(id);
  }

  @MessagePattern(EVENTS_PATTERNS.CREATE_BOOKING)
  createBooking(@Payload() data: CreateEventBookingDto): Promise<EventBookingDto> {
    return this.eventsService.createBooking(data);
  }

  @MessagePattern(EVENTS_PATTERNS.UPDATE_BOOKING)
  updateBooking(@Payload() payload: { id: number; data: UpdateEventBookingDto }): Promise<EventBookingDto> {
    return this.eventsService.updateBooking(payload.id, payload.data);
  }

  @MessagePattern(EVENTS_PATTERNS.DELETE_BOOKING)
  deleteBooking(@Payload() id: number): Promise<EventBookingDto> {
    return this.eventsService.deleteBooking(id);
  }

  @MessagePattern(EVENTS_PATTERNS.GET_UPCOMING_BOOKINGS)
  getUpcomingBookings(): Promise<EventBookingDto[]> {
    return this.eventsService.getUpcomingBookings();
  }
}
