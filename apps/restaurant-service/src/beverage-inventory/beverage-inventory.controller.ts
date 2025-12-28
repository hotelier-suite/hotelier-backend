import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { BeverageInventoryService } from './beverage-inventory.service';
import {
  BEVERAGE_INVENTORY_PATTERNS,
  BeverageInventoryDto,
  CreateBeverageItemDto,
  UpdateBeverageItemDto,
  FindBeverageInventoryFilterDto,
} from '@app/contracts/restaurant-service';

@Controller()
export class BeverageInventoryController {
  constructor(
    private readonly beverageInventoryService: BeverageInventoryService,
  ) {}

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.FIND_ALL)
  findAll(
    @Payload() filters: FindBeverageInventoryFilterDto,
  ): Promise<BeverageInventoryDto[]> {
    return this.beverageInventoryService.findAll(filters);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.FIND_ONE)
  findOne(@Payload() id: number): Promise<BeverageInventoryDto> {
    return this.beverageInventoryService.findOne(id);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.CREATE)
  create(
    @Payload() data: CreateBeverageItemDto,
  ): Promise<BeverageInventoryDto> {
    return this.beverageInventoryService.create(data);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.UPDATE)
  update(
    @Payload() payload: { id: number; data: UpdateBeverageItemDto },
  ): Promise<BeverageInventoryDto> {
    return this.beverageInventoryService.update(payload.id, payload.data);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.UPDATE_STOCK)
  updateStock(
    @Payload() payload: { id: number; stock: number },
  ): Promise<BeverageInventoryDto> {
    return this.beverageInventoryService.updateStock(payload.id, payload.stock);
  }

  @MessagePattern(BEVERAGE_INVENTORY_PATTERNS.DELETE)
  remove(@Payload() id: number): Promise<BeverageInventoryDto> {
    return this.beverageInventoryService.remove(id);
  }
}
