import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { INVENTORY_SERVICE_CLIENT } from '../constants';
import {
  INVENTORY_ITEMS_PATTERNS,
  InventoryItemDto,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  InventoryCategory,
  InventoryStatus,
} from '@app/contracts/inventory-service';

@Injectable()
export class ItemsService {
  constructor(
    @Inject(INVENTORY_SERVICE_CLIENT)
    private readonly inventoryClient: ClientProxy,
  ) {}

  findAll(
    category?: InventoryCategory,
    status?: InventoryStatus,
  ): Observable<InventoryItemDto[]> {
    return this.inventoryClient.send<
      InventoryItemDto[],
      { category?: InventoryCategory; status?: InventoryStatus }
    >(INVENTORY_ITEMS_PATTERNS.GET_ALL, { category, status });
  }

  create(data: CreateInventoryItemDto): Observable<InventoryItemDto> {
    return this.inventoryClient.send<InventoryItemDto, CreateInventoryItemDto>(
      INVENTORY_ITEMS_PATTERNS.CREATE,
      data,
    );
  }

  update(
    id: number,
    data: UpdateInventoryItemDto,
  ): Observable<InventoryItemDto> {
    return this.inventoryClient.send<
      InventoryItemDto,
      { id: number; data: UpdateInventoryItemDto }
    >(INVENTORY_ITEMS_PATTERNS.UPDATE, { id, data });
  }

  remove(id: number): Observable<InventoryItemDto> {
    return this.inventoryClient.send<InventoryItemDto, number>(
      INVENTORY_ITEMS_PATTERNS.DELETE,
      id,
    );
  }
}
