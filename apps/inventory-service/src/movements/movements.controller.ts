import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MovementsService } from './movements.service';
import {
  INVENTORY_MOVEMENTS_PATTERNS,
  InventoryMovementDto,
  CreateInventoryMovementDto,
} from '@app/contracts/inventory-service';

@Controller()
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @MessagePattern(INVENTORY_MOVEMENTS_PATTERNS.GET_ALL)
  findAll(): Promise<InventoryMovementDto[]> {
    return this.movementsService.findAll();
  }

  @MessagePattern(INVENTORY_MOVEMENTS_PATTERNS.CREATE)
  create(
    @Payload() data: CreateInventoryMovementDto,
  ): Promise<InventoryMovementDto> {
    return this.movementsService.create(data);
  }
}
