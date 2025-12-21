import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BOOKING_SERVICE_CLIENT } from '../constants';
import { GUESTS_PATTERNS } from '@app/contracts/booking-service/guests/guests.patterns';
import { GuestDto } from '@app/contracts/booking-service/guests/dto/guest.dto';
import { CreateGuestDto } from '@app/contracts/booking-service/guests/dto/create-guest.dto';
import { UpdateGuestDto } from '@app/contracts/booking-service/guests/dto/update-guest.dto';
import { ListGuestsQueryDto } from '@app/contracts/booking-service/guests/dto/list-guests-query.dto';

@Injectable()
export class GuestsService {
  constructor(
    @Inject(BOOKING_SERVICE_CLIENT)
    private readonly bookingClient: ClientProxy,
  ) {}

  findAll(query: ListGuestsQueryDto): Observable<GuestDto[]> {
    return this.bookingClient.send<GuestDto[], ListGuestsQueryDto>(
      GUESTS_PATTERNS.FIND_ALL,
      query,
    );
  }

  findOne(id: number): Observable<GuestDto> {
    return this.bookingClient.send<GuestDto, number>(
      GUESTS_PATTERNS.FIND_BY_ID,
      id,
    );
  }

  create(data: CreateGuestDto): Observable<GuestDto> {
    return this.bookingClient.send<GuestDto, CreateGuestDto>(
      GUESTS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateGuestDto): Observable<GuestDto> {
    return this.bookingClient.send<
      GuestDto,
      { id: number; data: UpdateGuestDto }
    >(GUESTS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<GuestDto> {
    return this.bookingClient.send<GuestDto, number>(
      GUESTS_PATTERNS.DELETE,
      id,
    );
  }
}
