import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RECREATIONAL_SERVICE_CLIENT } from '../constants';
import {
  RECREATIONAL_BOOKINGS_PATTERNS,
  RecreationalBookingDto,
  CreateRecreationalBookingDto,
  UpdateRecreationalBookingDto,
  BookingStatisticsDto,
} from '@app/contracts/recreational-service';

@Injectable()
export class BookingsService {
  constructor(
    @Inject(RECREATIONAL_SERVICE_CLIENT)
    private readonly recreationalClient: ClientProxy,
  ) {}

  findAll(): Observable<RecreationalBookingDto[]> {
    return this.recreationalClient.send<
      RecreationalBookingDto[],
      Record<string, never>
    >(RECREATIONAL_BOOKINGS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<RecreationalBookingDto> {
    return this.recreationalClient.send<RecreationalBookingDto, number>(
      RECREATIONAL_BOOKINGS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(
    data: CreateRecreationalBookingDto,
  ): Observable<RecreationalBookingDto> {
    return this.recreationalClient.send<
      RecreationalBookingDto,
      CreateRecreationalBookingDto
    >(RECREATIONAL_BOOKINGS_PATTERNS.CREATE, data);
  }

  update(
    id: number,
    data: UpdateRecreationalBookingDto,
  ): Observable<RecreationalBookingDto> {
    return this.recreationalClient.send<
      RecreationalBookingDto,
      { id: number; data: UpdateRecreationalBookingDto }
    >(RECREATIONAL_BOOKINGS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<RecreationalBookingDto> {
    return this.recreationalClient.send<RecreationalBookingDto, number>(
      RECREATIONAL_BOOKINGS_PATTERNS.DELETE,
      id,
    );
  }

  cancel(id: number, reason?: string): Observable<RecreationalBookingDto> {
    return this.recreationalClient.send<
      RecreationalBookingDto,
      { id: number; reason?: string }
    >(RECREATIONAL_BOOKINGS_PATTERNS.CANCEL, { id, reason });
  }

  checkIn(id: number): Observable<RecreationalBookingDto> {
    return this.recreationalClient.send<RecreationalBookingDto, number>(
      RECREATIONAL_BOOKINGS_PATTERNS.CHECK_IN,
      id,
    );
  }

  checkOut(id: number): Observable<RecreationalBookingDto> {
    return this.recreationalClient.send<RecreationalBookingDto, number>(
      RECREATIONAL_BOOKINGS_PATTERNS.CHECK_OUT,
      id,
    );
  }

  findByDate(date: Date): Observable<RecreationalBookingDto[]> {
    return this.recreationalClient.send<RecreationalBookingDto[], Date>(
      RECREATIONAL_BOOKINGS_PATTERNS.FIND_BY_DATE,
      date,
    );
  }

  findByFacility(
    facilityId: number,
    startDate?: Date,
    endDate?: Date,
  ): Observable<RecreationalBookingDto[]> {
    return this.recreationalClient.send<
      RecreationalBookingDto[],
      { facilityId: number; startDate?: Date; endDate?: Date }
    >(RECREATIONAL_BOOKINGS_PATTERNS.FIND_BY_FACILITY, {
      facilityId,
      startDate,
      endDate,
    });
  }

  getStatistics(
    startDate: Date,
    endDate: Date,
  ): Observable<BookingStatisticsDto> {
    return this.recreationalClient.send<
      BookingStatisticsDto,
      { startDate: Date; endDate: Date }
    >(RECREATIONAL_BOOKINGS_PATTERNS.GET_STATISTICS, {
      startDate,
      endDate,
    });
  }
}
