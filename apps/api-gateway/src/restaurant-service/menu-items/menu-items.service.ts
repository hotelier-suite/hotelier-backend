import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RESTAURANT_SERVICE_CLIENT } from '../constants';
import {
  MENU_ITEMS_PATTERNS,
  MenuItemDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from '@app/contracts/restaurant-service';

@Injectable()
export class MenuItemsService {
  constructor(
    @Inject(RESTAURANT_SERVICE_CLIENT)
    private readonly restaurantClient: ClientProxy,
  ) {}

  findAll(): Observable<MenuItemDto[]> {
    return this.restaurantClient.send<MenuItemDto[], Record<string, never>>(
      MENU_ITEMS_PATTERNS.FIND_ALL,
      {},
    );
  }

  findOne(id: number): Observable<MenuItemDto> {
    return this.restaurantClient.send<MenuItemDto, number>(
      MENU_ITEMS_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateMenuItemDto): Observable<MenuItemDto> {
    return this.restaurantClient.send<MenuItemDto, CreateMenuItemDto>(
      MENU_ITEMS_PATTERNS.CREATE,
      data,
    );
  }

  update(id: number, data: UpdateMenuItemDto): Observable<MenuItemDto> {
    return this.restaurantClient.send<
      MenuItemDto,
      { id: number; data: UpdateMenuItemDto }
    >(MENU_ITEMS_PATTERNS.UPDATE, { id, data });
  }

  delete(id: number): Observable<MenuItemDto> {
    return this.restaurantClient.send<MenuItemDto, number>(
      MENU_ITEMS_PATTERNS.DELETE,
      id,
    );
  }
}
