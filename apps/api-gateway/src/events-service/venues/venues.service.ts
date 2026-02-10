import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { EVENTS_SERVICE_CLIENT } from '../constants';
import {
  VENUES_PATTERNS,
  VenueDto,
  CreateVenueDto,
  UpdateVenueDto,
  FindVenuesFilterDto,
} from '@app/contracts/events-service';

@Injectable()
export class VenuesService {
  constructor(
    @Inject(EVENTS_SERVICE_CLIENT)
    private readonly eventsClient: ClientProxy,
  ) {}

  findAll(filters: FindVenuesFilterDto): Observable<VenueDto[]> {
    return this.eventsClient.send<VenueDto[], FindVenuesFilterDto>(
      VENUES_PATTERNS.FIND_ALL,
      filters,
    );
  }

  findOne(id: number): Observable<VenueDto> {
    return this.eventsClient.send<VenueDto, number>(
      VENUES_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateVenueDto): Observable<VenueDto> {
    return this.eventsClient.send<VenueDto, CreateVenueDto>(
      VENUES_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateVenueDto): Observable<VenueDto> {
    return this.eventsClient.send<
      VenueDto,
      { id: number; data: UpdateVenueDto }
    >(VENUES_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<VenueDto> {
    return this.eventsClient.send<VenueDto, number>(VENUES_PATTERNS.DELETE, id);
  }
}
