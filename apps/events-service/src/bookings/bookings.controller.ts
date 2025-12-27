import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BookingsService } from './bookings.service';
import {
  EVENT_BOOKINGS_PATTERNS,
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from '@app/contracts/events-service';

@Controller()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @MessagePattern(EVENT_BOOKINGS_PATTERNS.FIND_ALL)
  findAll(): Promise<EventBookingDto[]> {
    return this.bookingsService.findAll();
  }

  @MessagePattern(EVENT_BOOKINGS_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<EventBookingDto> {
    return this.bookingsService.findOne(id);
  }

  @MessagePattern(EVENT_BOOKINGS_PATTERNS.CREATE)
  create(@Payload() data: CreateEventBookingDto): Promise<EventBookingDto> {
    return this.bookingsService.create(data);
  }

  @MessagePattern(EVENT_BOOKINGS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateEventBookingDto },
  ): Promise<EventBookingDto> {
    return this.bookingsService.update(payload.id, payload.data);
  }

  @MessagePattern(EVENT_BOOKINGS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<EventBookingDto> {
    return this.bookingsService.remove(id);
  }

  @MessagePattern(EVENT_BOOKINGS_PATTERNS.FIND_UPCOMING)
  findUpcoming(): Promise<EventBookingDto[]> {
    return this.bookingsService.findUpcoming();
  }
}
