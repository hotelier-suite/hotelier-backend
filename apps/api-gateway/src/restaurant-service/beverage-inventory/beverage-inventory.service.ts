import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RESTAURANT_SERVICE_CLIENT } from '../constants';
import {
  BEVERAGE_INVENTORY_PATTERNS,
  BeverageInventoryDto,
  CreateBeverageItemDto,
  UpdateBeverageItemDto,
  FindBeverageInventoryFilterDto,
} from '@app/contracts/restaurant-service';

@Injectable()
export class BeverageInventoryService {
  constructor(
    @Inject(RESTAURANT_SERVICE_CLIENT)
    private readonly restaurantClient: ClientProxy,
  ) {}

  findAll(
    filters: FindBeverageInventoryFilterDto,
  ): Observable<BeverageInventoryDto[]> {
    return this.restaurantClient.send<
      BeverageInventoryDto[],
      FindBeverageInventoryFilterDto
    >(BEVERAGE_INVENTORY_PATTERNS.FIND_ALL, filters);
  }

  findOne(id: number): Observable<BeverageInventoryDto> {
    return this.restaurantClient.send<BeverageInventoryDto, number>(
      BEVERAGE_INVENTORY_PATTERNS.FIND_ONE,
      id,
    );
  }

  create(data: CreateBeverageItemDto): Observable<BeverageInventoryDto> {
    return this.restaurantClient.send<
      BeverageInventoryDto,
      CreateBeverageItemDto
    >(BEVERAGE_INVENTORY_PATTERNS.CREATE, data);
  }

  update(
    id: number,
    data: UpdateBeverageItemDto,
  ): Observable<BeverageInventoryDto> {
    return this.restaurantClient.send<
      BeverageInventoryDto,
      { id: number; data: UpdateBeverageItemDto }
    >(BEVERAGE_INVENTORY_PATTERNS.UPDATE, { id, data });
  }

  updateStock(id: number, stock: number): Observable<BeverageInventoryDto> {
    return this.restaurantClient.send<
      BeverageInventoryDto,
      { id: number; stock: number }
    >(BEVERAGE_INVENTORY_PATTERNS.UPDATE_STOCK, { id, stock });
  }

  remove(id: number): Observable<BeverageInventoryDto> {
    return this.restaurantClient.send<BeverageInventoryDto, number>(
      BEVERAGE_INVENTORY_PATTERNS.DELETE,
      id,
    );
  }
}
