import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RESTAURANT_SERVICE_CLIENT } from '../constants';
import {
  ROOM_SERVICE_ORDERS_PATTERNS,
  RoomServiceOrderDto,
  CreateRoomServiceOrderDto,
  UpdateRoomServiceOrderDto,
} from '@app/contracts/restaurant-service';

@Injectable()
export class RoomServiceOrdersService {
  constructor(
    @Inject(RESTAURANT_SERVICE_CLIENT)
    private readonly restaurantClient: ClientProxy,
  ) {}

  findAll(): Observable<RoomServiceOrderDto[]> {
    return this.restaurantClient.send<
      RoomServiceOrderDto[],
      Record<string, never>
    >(ROOM_SERVICE_ORDERS_PATTERNS.FIND_ALL, {});
  }

  findOne(id: number): Observable<RoomServiceOrderDto> {
    return this.restaurantClient.send<RoomServiceOrderDto, number>(
      ROOM_SERVICE_ORDERS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateRoomServiceOrderDto): Observable<RoomServiceOrderDto> {
    return this.restaurantClient.send<
      RoomServiceOrderDto,
      CreateRoomServiceOrderDto
    >(ROOM_SERVICE_ORDERS_PATTERNS.CREATE, data);
  }

  update(
    id: number,
    data: UpdateRoomServiceOrderDto,
  ): Observable<RoomServiceOrderDto> {
    return this.restaurantClient.send<
      RoomServiceOrderDto,
      { id: number; data: UpdateRoomServiceOrderDto }
    >(ROOM_SERVICE_ORDERS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<RoomServiceOrderDto> {
    return this.restaurantClient.send<RoomServiceOrderDto, number>(
      ROOM_SERVICE_ORDERS_PATTERNS.DELETE,
      id,
    );
  }
}
