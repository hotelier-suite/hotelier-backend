import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RESTAURANT_SERVICE_CLIENT } from '../constants';
import { BEVERAGE_INVENTORY_PATTERNS } from '@app/contracts/restaurant-service/beverage-inventory/beverage-inventory.patterns';
import {
  BeverageInventoryDto,
  CreateBeverageItemDto,
  UpdateBeverageItemDto,
} from '@app/contracts/restaurant-service/beverage-inventory/dto';

@Injectable()
export class BeverageInventoryService {
  constructor(
    @Inject(RESTAURANT_SERVICE_CLIENT)
    private readonly restaurantClient: ClientProxy,
  ) {}

  findAll(): Observable<BeverageInventoryDto[]> {
    return this.restaurantClient.send<
      BeverageInventoryDto[],
      Record<string, never>
    >(BEVERAGE_INVENTORY_PATTERNS.FIND_ALL, {});
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

  delete(id: number): Observable<BeverageInventoryDto> {
    return this.restaurantClient.send<BeverageInventoryDto, number>(
      BEVERAGE_INVENTORY_PATTERNS.DELETE,
      id,
    );
  }

  findLowStock(): Observable<BeverageInventoryDto[]> {
    return this.restaurantClient.send<
      BeverageInventoryDto[],
      Record<string, never>
    >(BEVERAGE_INVENTORY_PATTERNS.FIND_LOW_STOCK, {});
  }

  findByCategory(category: string): Observable<BeverageInventoryDto[]> {
    return this.restaurantClient.send<BeverageInventoryDto[], string>(
      BEVERAGE_INVENTORY_PATTERNS.FIND_BY_CATEGORY,
      category,
    );
  }
}
