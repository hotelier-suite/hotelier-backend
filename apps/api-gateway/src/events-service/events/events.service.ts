import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EVENTS_SERVICE_CLIENT } from '../constants';
import {
  EVENTS_PATTERNS,
  EventDto,
  CreateEventDto,
  UpdateEventDto,
} from '@app/contracts/events-service';

@Injectable()
export class EventsService {
  constructor(
    @Inject(EVENTS_SERVICE_CLIENT)
    private readonly eventsClient: ClientProxy,
  ) {}

  findAll(): Observable<EventDto[]> {
    return this.eventsClient.send<EventDto[], Record<string, never>>(
      EVENTS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<EventDto> {
    return this.eventsClient.send<EventDto, number>(
      EVENTS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateEventDto): Observable<EventDto> {
    return this.eventsClient.send<EventDto, CreateEventDto>(
      EVENTS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateEventDto): Observable<EventDto> {
    return this.eventsClient.send<
      EventDto,
      { id: number; data: UpdateEventDto }
    >(EVENTS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<EventDto> {
    return this.eventsClient.send<EventDto, number>(EVENTS_PATTERNS.DELETE, id);
  }
}
