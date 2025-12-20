import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { INVENTORY_SERVICE_CLIENT } from '../constants';
import { INVENTORY_ITEMS_PATTERNS } from '@app/contracts/inventory-service/items/items.patterns';
import { InventoryItemDto } from '@app/contracts/inventory-service/items/dto/inventory-item.dto';
import { CreateInventoryItemDto } from '@app/contracts/inventory-service/items/dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from '@app/contracts/inventory-service/items/dto/update-inventory-item.dto';
import { InventoryCategory } from '@app/contracts/inventory-service/items/enums/inventory-category.enum';
import { InventoryStatus } from '@app/contracts/inventory-service/items/enums/inventory-status.enum';

@Injectable()
export class ItemsService {
  constructor(
    @Inject(INVENTORY_SERVICE_CLIENT)
    private readonly inventoryClient: ClientProxy,
  ) {}

  findAll(): Observable<InventoryItemDto[]> {
    return this.inventoryClient.send<InventoryItemDto[], Record<string, never>>(
      INVENTORY_ITEMS_PATTERNS.GET_ALL,
      {},
    );
  }

  findByCategory(category: InventoryCategory): Observable<InventoryItemDto[]> {
    return this.inventoryClient.send<InventoryItemDto[], InventoryCategory>(
      INVENTORY_ITEMS_PATTERNS.GET_BY_CATEGORY,
      category,
    );
  }

  findByStatus(status: InventoryStatus): Observable<InventoryItemDto[]> {
    return this.inventoryClient.send<InventoryItemDto[], InventoryStatus>(
      INVENTORY_ITEMS_PATTERNS.GET_BY_STATUS,
      status,
    );
  }

  findLowStock(): Observable<InventoryItemDto[]> {
    return this.inventoryClient.send<InventoryItemDto[], Record<string, never>>(
      INVENTORY_ITEMS_PATTERNS.GET_LOW_STOCK,
      {},
    );
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
