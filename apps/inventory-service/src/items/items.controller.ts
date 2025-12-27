import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ItemsService } from './items.service';
import {
  INVENTORY_ITEMS_PATTERNS,
  InventoryItemDto,
  CreateInventoryItemDto,
  UpdateInventoryItemDto,
  InventoryCategory,
  InventoryStatus,
} from '@app/contracts/inventory-service';

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern(INVENTORY_ITEMS_PATTERNS.GET_ALL)
  findAll(
    @Payload()
    filters: {
      category?: InventoryCategory;
      status?: InventoryStatus;
    },
  ): Promise<InventoryItemDto[]> {
    return this.itemsService.findAll(filters.category, filters.status);
  }

  @MessagePattern(INVENTORY_ITEMS_PATTERNS.CREATE)
  create(@Payload() data: CreateInventoryItemDto): Promise<InventoryItemDto> {
    return this.itemsService.create(data);
  }

  @MessagePattern(INVENTORY_ITEMS_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateInventoryItemDto },
  ): Promise<InventoryItemDto> {
    return this.itemsService.update(payload.id, payload.data);
  }

  @MessagePattern(INVENTORY_ITEMS_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<InventoryItemDto> {
    return this.itemsService.remove(id);
  }
}
