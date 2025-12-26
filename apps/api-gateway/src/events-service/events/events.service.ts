import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EVENTS_SERVICE_CLIENT } from '../constants';
import {
  EVENTS_PATTERNS,
  EventDto,
  CreateEventDto,
  UpdateEventDto,
  EventBookingDto,
  CreateEventBookingDto,
  UpdateEventBookingDto,
} from '@app/contracts/events-service';

@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENTS_SERVICE_CLIENT)
    private readonly eventsClient: ClientProxy,
  ) {}

  // Event methods
  findAllEvents(): Observable<EventDto[]> {
    return this.eventsClient.send<EventDto[], Record<string, never>>(
      EVENTS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOneEvent(id: number): Observable<EventDto> {
    return this.eventsClient.send<EventDto, number>(
      EVENTS_PATTERNS.FIND_ONE,
      id,
    );
  }

  createEvent(data: CreateEventDto): Observable<EventDto> {
    return this.eventsClient.send<EventDto, CreateEventDto>(
      EVENTS_PATTERNS.CREATE,
      data,
    );
  }

  updateEvent(id: number, data: UpdateEventDto): Observable<EventDto> {
    return this.eventsClient.send<
      EventDto,
      { id: number; data: UpdateEventDto }
    >(EVENTS_PATTERNS.UPDATE, { id, data });
  }

  deleteEvent(id: number): Observable<EventDto> {
    return this.eventsClient.send<EventDto, number>(EVENTS_PATTERNS.DELETE, id);
  }

  // Event Booking methods
  findAllBookings(): Observable<EventBookingDto[]> {
    return this.eventsClient.send<EventBookingDto[], Record<string, never>>(
      EVENTS_PATTERNS.FIND_ALL_BOOKINGS,
      {},
    );
  }

  findOneBooking(id: number): Observable<EventBookingDto> {
    return this.eventsClient.send<EventBookingDto, number>(
      EVENTS_PATTERNS.FIND_ONE_BOOKING,
      id,
    );
  }

  createBooking(data: CreateEventBookingDto): Observable<EventBookingDto> {
    return this.eventsClient.send<EventBookingDto, CreateEventBookingDto>(
      EVENTS_PATTERNS.CREATE_BOOKING,
      data,
    );
  }

  updateBooking(
    id: number,
    data: UpdateEventBookingDto,
  ): Observable<EventBookingDto> {
    return this.eventsClient.send<
      EventBookingDto,
      { id: number; data: UpdateEventBookingDto }
    >(EVENTS_PATTERNS.UPDATE_BOOKING, { id, data });
  }

  deleteBooking(id: number): Observable<EventBookingDto> {
    return this.eventsClient.send<EventBookingDto, number>(
      EVENTS_PATTERNS.DELETE_BOOKING,
      id,
    );
  }

  getUpcomingBookings(): Observable<EventBookingDto[]> {
    return this.eventsClient.send<EventBookingDto[], Record<string, never>>(
      EVENTS_PATTERNS.GET_UPCOMING_BOOKINGS,
      {},
    );
  }
}
