import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { INVENTORY_ITEMS_PATTERNS } from '@app/contracts/inventory-service/items/items.patterns';
import { InventoryItemDto } from '@app/contracts/inventory-service/items/dto/inventory-item.dto';
import { CreateInventoryItemDto } from '@app/contracts/inventory-service/items/dto/create-inventory-item.dto';
import { UpdateInventoryItemDto } from '@app/contracts/inventory-service/items/dto/update-inventory-item.dto';
import { InventoryCategory } from '@app/contracts/inventory-service/items/enums/inventory-category.enum';
import { InventoryStatus } from '@app/contracts/inventory-service/items/enums/inventory-status.enum';
import { ItemsService } from './items.service';

@Controller()
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @MessagePattern(INVENTORY_ITEMS_PATTERNS.GET_ALL)
  findAll(): Promise<InventoryItemDto[]> {
    return this.itemsService.findAll();
  }

  @MessagePattern(INVENTORY_ITEMS_PATTERNS.GET_BY_CATEGORY)
  findByCategory(
    @Payload() category: InventoryCategory,
  ): Promise<InventoryItemDto[]> {
    return this.itemsService.findByCategory(category);
  }

  @MessagePattern(INVENTORY_ITEMS_PATTERNS.GET_BY_STATUS)
  findByStatus(
    @Payload() status: InventoryStatus,
  ): Promise<InventoryItemDto[]> {
    return this.itemsService.findByStatus(status);
  }

  @MessagePattern(INVENTORY_ITEMS_PATTERNS.GET_LOW_STOCK)
  findLowStock(): Promise<InventoryItemDto[]> {
    return this.itemsService.findLowStock();
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
