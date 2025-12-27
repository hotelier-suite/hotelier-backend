import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { BOOKING_SERVICE_CLIENT } from '../constants';
import {
  ROOMS_PATTERNS,
  RoomDto,
  CreateRoomDto,
  UpdateRoomDto,
  SetRoomAvailabilityDto,
} from '@app/contracts/booking-service';

@Injectable()
export class RoomsService {
  constructor(
    @Inject(BOOKING_SERVICE_CLIENT)
    private readonly bookingClient: ClientProxy,
  ) {}

  findAll(): Observable<RoomDto[]> {
    return this.bookingClient.send<RoomDto[], Record<string, never>>(
      ROOMS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<RoomDto> {
    return this.bookingClient.send<RoomDto, number>(
      ROOMS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateRoomDto): Observable<RoomDto> {
    return this.bookingClient.send<RoomDto, CreateRoomDto>(
      ROOMS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateRoomDto): Observable<RoomDto> {
    return this.bookingClient.send<
      RoomDto,
      { id: number; data: UpdateRoomDto }
    >(ROOMS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<RoomDto> {
    return this.bookingClient.send<RoomDto, number>(ROOMS_PATTERNS.DELETE, id);
  }

  setAvailability(id: number, isAvailable: boolean): Observable<RoomDto> {
    const payload: SetRoomAvailabilityDto = { id, isAvailable };

    return this.bookingClient.send<RoomDto, SetRoomAvailabilityDto>(
      ROOMS_PATTERNS.SET_AVAILABILITY,
      payload,
    );
  }
}
