import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EVENTS_SERVICE_CLIENT } from '../constants';
import {
  EVENT_BOOKINGS_PATTERNS,
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from '@app/contracts/events-service';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(EVENTS_SERVICE_CLIENT)
    private readonly eventsClient: ClientProxy,
  ) {}

  findAll(): Observable<EventBookingDto[]> {
    return this.eventsClient.send<EventBookingDto[], Record<string, never>>(
      EVENT_BOOKINGS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<EventBookingDto> {
    return this.eventsClient.send<EventBookingDto, number>(
      EVENT_BOOKINGS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateEventBookingDto): Observable<EventBookingDto> {
    return this.eventsClient.send<EventBookingDto, CreateEventBookingDto>(
      EVENT_BOOKINGS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateEventBookingDto): Observable<EventBookingDto> {
    return this.eventsClient.send<
      EventBookingDto,
      { id: number; data: UpdateEventBookingDto }
    >(EVENT_BOOKINGS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<EventBookingDto> {
    return this.eventsClient.send<EventBookingDto, number>(
      EVENT_BOOKINGS_PATTERNS.DELETE,
      id,
    );
  }

  findUpcoming(): Observable<EventBookingDto[]> {
    return this.eventsClient.send<EventBookingDto[], Record<string, never>>(
      EVENT_BOOKINGS_PATTERNS.FIND_UPCOMING,
      {},
    );
  }
}
